import MessagePayload from "../client/type/messagePayload"
import {MobEntity} from "../mob/entity/mobEntity"
import ClientRequest from "./clientRequest"
import {ResponseStatus} from "./enum/responseStatus"
import ResponseMessage from "./responseMessage"

export default class Response {
  constructor(
    readonly request: ClientRequest,
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

  public getPayload(): MessagePayload {
    return {
      message: this.message.getMessageToRequestCreator(),
      status: this.status,
    }
  }

  public getMob(): MobEntity {
    return this.request.getMob()
  }
}
