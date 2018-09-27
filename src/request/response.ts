import { Request } from "./request"
import ResponseAction from "./responseAction"
import { ResponseStatus } from "./responseStatus"

export default class Response {
  constructor(
    readonly request: Request,
    readonly status: ResponseStatus,
    readonly message: string,
    readonly responseAction: ResponseAction = null) {}
}
