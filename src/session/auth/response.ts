import AuthStep from "./authStep/authStep"
import { ResponseStatus } from "./enum/responseStatus"
import Request from "./request"

export default interface Response {
  readonly request: Request,
  readonly status: ResponseStatus,
  readonly authStep: AuthStep,
  readonly message: string
}
