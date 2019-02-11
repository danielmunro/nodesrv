import { Mob } from "../mob/model/mob"
import { Request } from "../request/request"
import Response from "../request/response"
import ResponseBuilder from "../request/responseBuilder"
import ResponseMessage from "../request/responseMessage"
import {ResponseStatus} from "../request/responseStatus"
import { Room } from "../room/model/room"
import Maybe from "../support/functional/maybe"
import Check from "./check"
import { CheckType } from "./checkType"

export default class CheckedRequest {
  private static getResult(thing: any) {
    if (typeof thing === "function") {
      return thing()
    }

    return thing
  }

  public readonly mob: Mob
  public readonly room: Room

  constructor(public readonly request: Request, public readonly check: Check) {
    this.mob = request.mob
    this.room = request.getRoom()
  }

  public getCheckTypeResult(checkType: CheckType) {
    return new Maybe(this.check.checkResults.find(r => r.checkType === checkType))
      .do(result => CheckedRequest.getResult(result.thing))
      .get()
  }

  public results(...checkTypes: CheckType[]) {
    return checkTypes.map(checkType => this.getCheckTypeResult(checkType))
  }

  public respondWith(): ResponseBuilder {
    return new ResponseBuilder(this)
  }

  public responseWithMessage(responseStatus: ResponseStatus, responseMessage: ResponseMessage): Promise<Response> {
    return Promise.resolve(new Response(this, responseStatus, responseMessage))
  }

  public response(
    responseStatus: ResponseStatus,
    message: string,
    toRequestCreator: object,
    toTarget: object,
    toObservers: object): Response {
    return new Response(this, responseStatus, new ResponseMessage(
      this.mob, message, toRequestCreator, toTarget, toObservers))
  }
}
