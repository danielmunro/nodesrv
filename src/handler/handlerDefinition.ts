import { RequestType } from "../request/requestType"
import { Request } from "./../request/request"
import { RequestTypeMismatch } from "./exceptions"

export class HandlerDefinition {
  private readonly requestType: RequestType
  private readonly callback: (request: Request) => Promise<any>

  constructor(requestType: RequestType, callback) {
    this.requestType = requestType
    this.callback = callback
  }

  public isAbleToHandleRequestType(requestType: RequestType): boolean {
    return this.requestType.startsWith(requestType) || this.requestType === RequestType.Any
  }

  public handle(request: Request): Promise<any> {
    if (!this.isAbleToHandleRequestType(request.requestType)) {
      throw new RequestTypeMismatch()
    }

    return new Promise((resolve) => this.callback(request).then((result) => resolve(result)))
  }
}
