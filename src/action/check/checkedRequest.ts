import { Request } from "../../request/request"
import ResponseBuilder from "../../request/responseBuilder"
import Check from "./check"
import { CheckType } from "./checkType"

export default class CheckedRequest {
  constructor(
    public readonly request: Request,
    public readonly check: Check,
  ) {}

  public getCheckTypeResult(checkType: CheckType) {
    return this.check.checkResults.find(r => r.checkType === checkType).thing
  }

  public respondWith(): ResponseBuilder {
    return new ResponseBuilder(this.request)
  }
}
