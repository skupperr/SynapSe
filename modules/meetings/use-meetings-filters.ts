import { DEFAULT_PAGE } from "@/constants"
import { parseAsInteger, parseAsString, useQueryStates, parseAsStringEnum } from "nuqs"
import { MeetingStatus } from "./types"

export const useMeetingsFilters = () => {
    return useQueryStates({
        search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true}),
        status: parseAsStringEnum(Object.values(MeetingStatus)),
        agentId: parseAsString.withDefault("").withOptions({clearOnDefault: true})
    });
};

// localhost:3000?search=hello <==> useState()

// we won't allow users to change pageSize
// localhost:3000?pageSize=100000000 will break our app