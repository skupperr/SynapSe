import { DEFAULT_PAGE } from "@/constants"
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

export const useAgentsFilters = () => {
    return useQueryStates({
        search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true}),
    })
}

// localhost:3000?search=hello <==> useState()

// we won't allow users to change pageSize
// localhost:3000?pageSize=100000000 will break our app