import {Mob} from "../mob/model/mob"
import Request from "../request/request"
import Response from "../request/response"
import ResponseBuilder from "../request/responseBuilder"
import ResponseMessage from "../request/responseMessage"
import {ResponseStatus} from "../request/responseStatus"
import {Room} from "../room/model/room"
import Check from "./check"
import {CheckType} from "./checkType"

export default class CheckedRequest {

  public readonly mob: Mob
  public readonly room: Room

  constructor(public readonly request: Request, public readonly check: Check) {
    this.mob = request.mob
    this.room = request.getRoom()
  }

  public getTarget() {
    return this.getCheckTypeResult(CheckType.HasTarget)
  }

  public getCheckTypeResult(checkType: CheckType) {
    return this.check.getCheckTypeResult(checkType)
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
