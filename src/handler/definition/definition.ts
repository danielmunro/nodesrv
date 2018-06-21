import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import Response from "../../request/response"

export const MESSAGE_REQUEST_TYPE_MISMATCH = "Request type mismatch"

export class Definition {
  private readonly requestType: RequestType
  private readonly callback: (request: Request) => Promise<Response>

  constructor(requestType: RequestType, callback) {
    this.requestType = requestType
    this.callback = callback
  }

  public isAbleToHandleRequestType(requestType: RequestType): boolean {
    return this.requestType.startsWith(requestType) || this.requestType === RequestType.Any
  }

  public async handle(request: Request): Promise<Response> {
    if (!this.isAbleToHandleRequestType(request.requestType)) {
      throw new Error(MESSAGE_REQUEST_TYPE_MISMATCH)
    }

    return this.callback(request)
  }
}
