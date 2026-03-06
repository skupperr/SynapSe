import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { generateAvatarUri } from "@/lib/avatar";
import { streamChat } from "@/lib/stream-chat";
import { streamVideo } from "@/lib/stream-video";
import { CallEndedEvent, CallRecordingReadyEvent, CallSessionParticipantLeftEvent, CallSessionStartedEvent, CallTranscriptionReadyEvent, MessageNewEvent } from "@stream-io/node-sdk";
import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, Content } from "@google/generative-ai";

const geminiClient = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

function verifySignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature);
};

export async function POST(req: NextRequest) {
    const signature = req.headers.get("x-signature");
    const apiKey = req.headers.get("x-api-key");

    if (!signature || !apiKey) {
        return NextResponse.json(
            { error: "Missing signature or API key" },
            { status: 400 }
        )
    }

    const body = await req.text();

    if (!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    let payload: unknown;
    try {
        payload = JSON.parse(body) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const eventType = (payload as Record<string, unknown>)?.type;

    if (eventType === "call.session_started") {
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        // const [existingMeeting] = await db
        //     .select()
        //     .from(meetings)
        //     .where(
        //         and(
        //             eq(meetings.id, meetingId),
        //             not(eq(meetings.status, "completed")),
        //             not(eq(meetings.status, "active")),
        //             not(eq(meetings.status, "cancelled")),
        //             not(eq(meetings.status, "processing")),
        //         )
        //     );

        // if (!existingMeeting) {
        //     return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
        // }

        // await db
        //     .update(meetings)
        //     .set({
        //         status: "active",
        //         startedAt: new Date(),
        //     })
        //     .where(eq(meetings.id, existingMeeting.id));

        const [updatedMeeting] = await db
            .update(meetings)
            .set({
                status: "active",
                startedAt: new Date(),
            })
            .where(
                and(
                    eq(meetings.id, meetingId),
                    not(eq(meetings.status, "completed")),
                    not(eq(meetings.status, "active")),
                    not(eq(meetings.status, "cancelled")),
                    not(eq(meetings.status, "processing")),
                )
            )
            .returning();

        if (!updatedMeeting) {
            return NextResponse.json({ error: "Meeting not found or already active" }, { status: 404 });
        }

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, updatedMeeting.agentId));

        if (!existingAgent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        try {
            const call = streamVideo.video.call("default", meetingId);
            const realtimeClient = await streamVideo.video.connectOpenAi({
                call,
                openAiApiKey: process.env.OPENAI_API!,
                agentUserId: existingAgent.id,
            });

            realtimeClient.updateSession({
                instructions: existingAgent.instructions,
            });
        } catch (error) {
            console.log("Error connecting to stream video or OpenAI: ", error);
            return NextResponse.json({ error: "External API error" }, { status: 500 });
        }


    } else if (eventType === "call.session_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent;

        const meetingId = event.call_cid.split(":")[1];  //call_cid is formatted as "type:id"
        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        try {
            const call = streamVideo.video.call("default", meetingId);
            await call.end();
        } catch (error) {
            console.error("Error ending call: ", error);
            return NextResponse.json({ error: "Failed to end call" }, { status: 500 });
        }
    } else if (eventType === "call.session_ended") {
        const event = payload as CallEndedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        await db
            .update(meetings)
            .set({
                status: "processing",
                endedAt: new Date(),
            })
            .where(
                and(
                    eq(meetings.id, meetingId),
                    eq(meetings.status, "active")
                )
            )
    } else if (eventType === "call.transcription_ready") {
        const event = payload as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        const [updatedMeeting] = await db
            .update(meetings)
            .set({
                transcriptUrl: event.call_transcription.url,
            })
            .where(eq(meetings.id, meetingId))
            .returning();

        if (!updatedMeeting) {
            return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
        }

        await inngest.send({
            name: "meetings/processing",
            data: {
                meetingId: updatedMeeting.id,
                transcriptUrl: updatedMeeting.transcriptUrl
            }
        });
    } else if (eventType === "call.recording_ready") {
        const event = payload as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        await db
            .update(meetings)
            .set({
                recordingUrl: event.call_recording.url,
            })
            .where(eq(meetings.id, meetingId));

    } else if (eventType === "message.new") {
        const event = payload as MessageNewEvent;
        const userId = event.user?.id;
        const channelId = event.channel_id;
        const text = event.message?.text;

        if (!userId || !channelId || !text) {
            return NextResponse.json(
                { error: "Missing required fields" }, { status: 400 }
            );

        }

        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(and(eq(meetings.id, channelId), eq(meetings.status, "completed")));

        if (!existingMeeting) {
            return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
        }

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));

        if (!existingAgent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        if (userId !== existingAgent.id) {
            const instructions = `
            You are an AI assistant helping the user revisit a recently completed meeting.
            Below is a summary of the meeting, generated from the transcript:
            
            ${existingMeeting.summary}
            
            The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
            
            ${existingAgent.instructions}
            
            The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
            Always base your responses on the meeting summary above.
            
            You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
            
            If the summary does not contain enough information to answer a question, politely let the user know.
            
            Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
            `;

            const channel = streamChat.channel("messaging", channelId);
            await channel.watch();

            const model = geminiClient.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

            const previousMessages = channel.state.messages
                .slice(-5)
                .filter((msg) => msg.text && msg.text.trim() !== "")
                .map<Content>((message) => ({
                    role: message.user?.id === existingAgent.id ? "model" : "user",
                    parts: [{ text: message.text ?? "" }],
                }));

            const history: Content[] = [
                ...previousMessages,
            ];

            if (event.user?.id === existingAgent.id) {
                return NextResponse.json({ status: "ignored agent message" });
            }
            const chat = model.startChat({
                history,
                systemInstruction: {
                    role: "system",
                    parts: [{ text: instructions }],
                },
                generationConfig: {
                    maxOutputTokens: 1024,
                },
            });

            const result = await chat.sendMessage(text);
            const GeminiResponseText = result.response.text();


            if (!GeminiResponseText) {
                return NextResponse.json(
                    { error: "No response from Gemini" },
                    { status: 400 }
                );
            }
            const avatarUrl = generateAvatarUri({
                seed: existingAgent.name,
                variant: "botttsNeutral",
            });

            streamChat.upsertUser({
                id: existingAgent.id,
                name: existingAgent.name,
                image: avatarUrl,
            });

            await channel.sendMessage({
                text: GeminiResponseText,
                user: {
                    id: existingAgent.id,
                    name: existingAgent.name,
                    image: avatarUrl,
                },
            });
        }
    }
    return NextResponse.json({ status: "ok" })
}