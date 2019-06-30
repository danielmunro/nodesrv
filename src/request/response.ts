import CheckedRequest from "../check/checkedRequest"
import {ResponseStatus} from "./enum/responseStatus"
import Request from "./request"
import ResponseMessage from "./responseMessage"

export default class Response {
  constructor(
    readonly request: Request | CheckedRequest,
    readonly status: ResponseStatus,
    readonly message: ResponseMessage) {}

  public isSuccessful(): boolean {
    return this.status === ResponseStatus.Success || this.status === ResponseStatus.Ok
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

  public getMessageToTarget(): string {
    return this.message.getMessageToTarget()
  }

  public getMessageToObservers(): string {
    return this.message.getMessageToObservers()
  }

  public getPayload(): object {
    return {
      message: this.message.getMessageToRequestCreator(),
      status: this.status,
    }
  }
}
