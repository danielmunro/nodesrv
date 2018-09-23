import Response from "../../request/response"
import { ResponseStatus } from "../../request/responseStatus"
import CheckedRequest from "../checkedRequest"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  return Promise.resolve(new Response(checkedRequest.request, ResponseStatus.Info, "not implemented"))
}
