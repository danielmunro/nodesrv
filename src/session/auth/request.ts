import {Client} from "../../client/client"
import InputContext from "../../messageExchange/context/inputContext"
import {RequestType} from "../../messageExchange/enum/requestType"
import match from "../../support/matcher/match"
import AuthStep from "./authStep/authStep"
import {ResponseStatus} from "./enum/responseStatus"
import {createResponse} from "./factory/requestAuthFactory"
import Response from "./response"

const confirm = "yes"
const deny = "no"

export default class Request {
  constructor(
    public readonly client: Client,
    public readonly input: string) {}

  public getContextAsInput(): InputContext {
    return new InputContext(RequestType.Noop, this.input)
  }

  public fail(authStep: AuthStep, message: string): Response {
    return createResponse(
      this,
      ResponseStatus.FAILED,
      authStep,
      message)
  }

  public ok(authStep: AuthStep, message?: string): Response {
    return createResponse(
      this,
      ResponseStatus.OK,
      authStep,
      message)
  }

  public didConfirm() {
    return match(confirm, this.input)
  }

  public didDeny() {
    return match(deny, this.input)
  }

  public getType(): RequestType {
    return RequestType.Any
  }
}
