import AuthStep from "./authStep"
import { ResponseStatus } from "./enum/responseStatus"
import Request from "./request"

export default class Response {
  public readonly request: Request
  public readonly status: ResponseStatus
  public readonly authStep: AuthStep
  public readonly message: string

  constructor(request: Request, status: ResponseStatus, authStep: AuthStep, message: string = null) {
    this.request = request
    this.status = status
    this.authStep = authStep
    this.message = message
  }
}
