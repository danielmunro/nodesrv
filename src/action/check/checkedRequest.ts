import Maybe from "../../functional/maybe"
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
    return new Maybe(this.check.checkResults.find(r => r.checkType === checkType))
      .do(result => result.thing)
      .get()
  }

  public respondWith(): ResponseBuilder {
    return this.request.respondWith(...arguments)
  }
}
