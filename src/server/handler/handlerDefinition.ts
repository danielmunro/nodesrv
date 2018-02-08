import { RequestType } from "./constants"
import { Request } from "./request"

export class HandlerDefinition {
  private requestType: RequestType
  private callback: (request: Request, cb: (result) => void) => void

  constructor(requestType: RequestType, callback) {
    this.requestType = requestType
    this.callback = callback
  }

  public isMatch(requestType: RequestType): boolean {
    return this.requestType === requestType
  }

  public applyCallback(request: Request, cb: (response) => void) {
    this.callback(request, cb)
  }
}