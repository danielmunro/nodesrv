import { Disposition } from "../../mob/disposition"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import CheckedRequest from "../checkedRequest"

export const MESSAGE_SLEEP_SUCCESS = "You lay down and go to sleep."

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  request.mob.disposition = Disposition.Sleeping

  return new ResponseBuilder(request).success(MESSAGE_SLEEP_SUCCESS)
}
