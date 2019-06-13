import {MobEntity} from "../mob/entity/mobEntity"
import ResponseBuilder from "../request/builder/responseBuilder"
import {ResponseStatus} from "../request/enum/responseStatus"
import Request from "../request/request"
import Response from "../request/response"
import ResponseMessage from "../request/responseMessage"
import {RoomEntity} from "../room/entity/roomEntity"
import Check from "./check"
import {CheckType} from "./enum/checkType"

export default class CheckedRequest {
  public readonly mob: MobEntity
  public readonly room: RoomEntity

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
