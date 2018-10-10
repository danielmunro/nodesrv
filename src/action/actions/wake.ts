import CheckedRequest from "../../check/checkedRequest"
import { Disposition } from "../../mob/disposition"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  checkedRequest.request.mob.disposition = Disposition.Standing

  return checkedRequest.respondWith().success(new ResponseMessage(Messages.Wake.Success))
}
