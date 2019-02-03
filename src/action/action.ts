import Check from "../check/check"
import CheckedRequest from "../check/checkedRequest"
import { CheckStatus } from "../check/checkStatus"
import { Request } from "../request/request"
import { RequestType } from "../request/requestType"
import Response from "../request/response"

export default abstract class Action {
  public isAbleToHandleRequestType(requestType: RequestType): boolean {
    const thisRequestType = this.getRequestType()
    return thisRequestType.startsWith(requestType) || requestType === RequestType.Any
  }

  public async handle(request: Request): Promise<Response> {
    if (!this.isAbleToHandleRequestType(request.getType())) {
      throw new Error("request type mismatch")
    }

    const checkResponse = await this.check(request)
    if (checkResponse.status === CheckStatus.Failed) {
      return request.respondWith().error(checkResponse.result)
    }

    return this.invoke(new CheckedRequest(request, checkResponse))
  }

  public abstract check(request: Request): Promise<Check>
  public abstract invoke(checkedRequest: CheckedRequest): Promise<Response>
  protected abstract getRequestType(): RequestType
}
