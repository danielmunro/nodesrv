import { Disposition } from "../../mob/disposition"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import CheckedRequest from "../checkedRequest"

export const MESSAGE_WAKE_SUCCESS = "You wake and stand up."

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  request.mob.disposition = Disposition.Standing

  return new ResponseBuilder(request).success(MESSAGE_WAKE_SUCCESS)
}
