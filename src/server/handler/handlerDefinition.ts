import { RequestType } from "./constants"
import { RequestTypeMismatch } from "./exceptions"
import { Request } from "./../request/request"

export class HandlerDefinition {
  private requestType: RequestType
  private callback: (request: Request, cb: (result) => void) => void

  constructor(requestType: RequestType, callback) {
    this.requestType = requestType
    this.callback = callback
  }

  public isAbleToHandleRequestType(requestType: RequestType): boolean {
    return this.requestType === requestType
  }

  public applyCallback(request: Request, cb: (response) => void) {
    if (!this.isAbleToHandleRequestType(request.getRequestType())) {
      throw new RequestTypeMismatch()
    }
    this.callback(request, cb)
  }
}