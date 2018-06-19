import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"

export const MESSAGE_REQUEST_TYPE_MISMATCH = "Request type mismatch"

export class Definition {
  private readonly requestType: RequestType
  private readonly callback: (request: Request) => Promise<any>

  constructor(requestType: RequestType, callback) {
    this.requestType = requestType
    this.callback = callback
  }

  public isAbleToHandleRequestType(requestType: RequestType): boolean {
    return this.requestType.startsWith(requestType) || this.requestType === RequestType.Any
  }

  public async handle(request: Request): Promise<any> {
    if (!this.isAbleToHandleRequestType(request.requestType)) {
      throw new Error(MESSAGE_REQUEST_TYPE_MISMATCH)
    }

    const result = await this.callback(request)

    return new Promise((resolve) => resolve(result))
  }
}
