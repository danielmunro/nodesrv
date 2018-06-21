import { Request } from "./request"
import { ResponseStatus } from "./responseStatus"

export default class {
  constructor(
    readonly request: Request,
    readonly status: ResponseStatus,
    readonly message: string) {
  }
}
