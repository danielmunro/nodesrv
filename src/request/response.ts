import CheckedRequest from "../check/checkedRequest"
import { Request } from "./request"
import ResponseAction from "./responseAction"
import { ResponseStatus } from "./responseStatus"

export default class Response {
  constructor(
    readonly request: Request | CheckedRequest,
    readonly status: ResponseStatus,
    readonly message: string,
    readonly responseAction: ResponseAction = null) {}

  public isSuccessful(): boolean {
    return this.status === ResponseStatus.Success
  }

  public getCheckedRequest(): CheckedRequest {
    return this.request as CheckedRequest
  }
}
