import { RequestType } from "./constants"
import { RequestTypeMismatch } from "./exceptions"
import { Request } from "./../request/request"

export class HandlerDefinition {
  private readonly requestType: RequestType
  private readonly callback: (request: Request, cb: (result) => void) => void

  constructor(requestType: RequestType, callback) {
    this.requestType = requestType
    this.callback = callback
  }

  public isAbleToHandleRequestType(requestType: RequestType): boolean {
    return this.requestType === requestType
  }

  public applyCallback(request: Request, cb: (response) => void) {
    if (!this.isAbleToHandleRequestType(request.requestType)) {
      throw new RequestTypeMismatch()
    }
    this.callback(request, cb)
  }
}