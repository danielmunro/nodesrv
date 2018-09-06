import CheckedRequest from "../../checkedRequest"
import Response from "../../../request/response"
import ResponseBuilder from "../../../request/responseBuilder"
import { Standing } from "../../../mob/standing"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const target = checkedRequest.check.result
  target.playerMob.standing = Standing.Good
  const responseBuilder = new ResponseBuilder(request)

  return responseBuilder.success(`You have lifted the ban on ${target.name}.`)
}