import CheckedRequest from "../check/checkedRequest"
import { Request } from "./request"
import ResponseAction from "./responseAction"
import ResponseMessage from "./responseMessage"
import { ResponseStatus } from "./responseStatus"

export default class Response {
  constructor(
    readonly request: Request | CheckedRequest,
    readonly status: ResponseStatus,
    readonly message: ResponseMessage,
    readonly responseAction: ResponseAction = null) {}

  public isSuccessful(): boolean {
    return this.status === ResponseStatus.Success
  }

  public isFailure(): boolean {
    return this.status === ResponseStatus.ActionFailed
  }

  public isError(): boolean {
    return this.status === ResponseStatus.PreconditionsFailed
  }

  public getCheckedRequest(): CheckedRequest {
    return this.request as CheckedRequest
  }
}
