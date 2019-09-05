import {ResponseStatus} from "../../messageExchange/enum/responseStatus"

export default interface MessagePayload {
  readonly message: string
  readonly status: ResponseStatus
}
