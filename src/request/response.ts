import CheckedRequest from "../check/checkedRequest"
import { Request } from "./request"
import ResponseMessage from "./responseMessage"
import { ResponseStatus } from "./responseStatus"
import Check from "../check/check"

export default class Response {
  constructor(
    readonly request: Request | CheckedRequest,
    readonly status: ResponseStatus,
    readonly message: ResponseMessage) {}

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

  public getCheck(): Check {
    return this.getCheckedRequest().check
  }

  public getPayload(): object {
    return {
      message: this.message.getMessageToRequestCreator(),
      status: this.status,
    }
  }
}
