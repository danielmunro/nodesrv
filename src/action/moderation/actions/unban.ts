import { Standing } from "../../../mob/standing"
import Response from "../../../request/response"
import ResponseBuilder from "../../../request/responseBuilder"
import CheckedRequest from "../../check/checkedRequest"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const target = checkedRequest.check.result
  target.playerMob.standing = Standing.Good
  return new ResponseBuilder(request).success(`You have lifted the ban on ${target.name}.`)
}
