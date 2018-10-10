import CheckedRequest from "../../../check/checkedRequest"
import { Standing } from "../../../mob/standing"
import Response from "../../../request/response"
import ResponseMessage from "../../../request/responseMessage"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const target = checkedRequest.check.result
  target.playerMob.standing = Standing.Good
  return request.respondWith().success(
    new ResponseMessage(`You have lifted the ban on ${target.name}.`))
}
