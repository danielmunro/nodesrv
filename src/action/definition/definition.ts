import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import Service from "../../room/service"
import Check, { CheckStatus } from "../check"
import CheckedRequest from "../checkedRequest"

export const MESSAGE_REQUEST_TYPE_MISMATCH = "Request type mismatch"

export class Definition {
  constructor(
    private readonly service: Service,
    private readonly requestType: RequestType,
    private readonly callback: (request: Request|CheckedRequest, service: Service) => Promise<Response>,
    private readonly precondition: (request: Request, service: Service) => Promise<Check> = null,
    ) {}

  public isAbleToHandleRequestType(requestType: RequestType): boolean {
    return this.requestType.startsWith(requestType) || this.requestType === RequestType.Any
  }

  public async handle(request: Request): Promise<Response> {
    if (!this.isAbleToHandleRequestType(request.requestType)) {
      throw new Error(MESSAGE_REQUEST_TYPE_MISMATCH)
    }

    if (this.precondition) {
      const checkResponse = await this.precondition(request, this.service)
      if (checkResponse.status === CheckStatus.Failed) {
        return new ResponseBuilder(request).fail(checkResponse.result)
      }

      return this.callback(new CheckedRequest(request, checkResponse), this.service)
    }

    return this.callback(request, this.service)
  }
}
