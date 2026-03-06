"use client"

interface Props{
    meetingId: string;
    meetingName: string
}

import { LoadingState } from '@/components/loading-state';
import { authClient } from '@/lib/auth-client';
import React from 'react'
import { ChatUI } from './chat-ui';

export const ChatProvider = ({meetingId, meetingName}: Props) => {

    const { data, isPending } = authClient.useSession();

    if(isPending || !data?.user){
        return (
            <LoadingState 
                title='Loading...'
                description='Please wait while your chat is being loaded'
            />
        )
    }

  return (
    <ChatUI
        meetingId={meetingId}
        userId={data.user.id}
        userName={data.user.name}
        userImage={data.user.image ?? ""}
    />
  )
}
