import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import Check, { CheckStatus } from "../check"

export const MESSAGE_REQUEST_TYPE_MISMATCH = "Request type mismatch"

export class Definition {
  constructor(
    private readonly requestType: RequestType,
    private readonly callback: (request: Request) => Promise<Response>,
    private readonly precondition: (request: Request) => Promise<Check> = null,
    ) {
  }

  public isAbleToHandleRequestType(requestType: RequestType): boolean {
    return this.requestType.startsWith(requestType) || this.requestType === RequestType.Any
  }

  public async handle(request: Request): Promise<Response> {
    if (!this.isAbleToHandleRequestType(request.requestType)) {
      throw new Error(MESSAGE_REQUEST_TYPE_MISMATCH)
    }

    if (this.precondition) {
      const checkResponse = await this.precondition(request)
      if (CheckStatus.Failed) {
        return new ResponseBuilder(request).fail(checkResponse.message)
      }
    }

    return this.callback(request)
  }
}
