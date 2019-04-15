import CheckedRequest from "../check/checkedRequest"
import Request from "./request"
import ResponseMessage from "./responseMessage"
import { ResponseStatus } from "./responseStatus"

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

  public getMessageToRequestCreator(): string {
    return this.message.getMessageToRequestCreator()
  }

  public getPayload(): object {
    return {
      message: this.message.getMessageToRequestCreator(),
      status: this.status,
    }
  }
}
