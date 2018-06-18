import { RequestType } from "../../request/requestType"
import { Definition } from "./definition"

export function newDefinition(requestType: RequestType, cb) {
  return new Definition(requestType, cb)
}
