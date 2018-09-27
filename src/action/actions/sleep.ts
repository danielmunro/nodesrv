import { Disposition } from "../../mob/disposition"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import CheckedRequest from "../check/checkedRequest"
import { MESSAGE_SLEEP_SUCCESS } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  request.mob.disposition = Disposition.Sleeping

  return request.respondWith().success(MESSAGE_SLEEP_SUCCESS)
}
