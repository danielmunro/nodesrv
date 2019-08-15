import ResponseBuilder from "../messageExchange/builder/responseBuilder"
import ClientRequest from "../messageExchange/clientRequest"
import {ResponseStatus} from "../messageExchange/enum/responseStatus"
import Request from "../messageExchange/request"
import Response from "../messageExchange/response"
import ResponseMessage from "../messageExchange/responseMessage"
import {MobEntity} from "../mob/entity/mobEntity"
import {RoomEntity} from "../room/entity/roomEntity"
import Check from "./check"
import {CheckType} from "./enum/checkType"

export default class CheckedRequest implements ClientRequest {
  public readonly mob: MobEntity
  public readonly room: RoomEntity

  constructor(public readonly request: Request, public readonly check: Check) {
    this.mob = request.mob
    this.room = request.getRoom()
  }

  public getTargetMobInRoom(): MobEntity {
    return this.getCheckTypeResult<MobEntity>(CheckType.HasTarget)
  }

  public getMob(): MobEntity {
    return this.mob
  }

  public getCheckTypeResult<T>(checkType: CheckType) {
    return this.check.getCheckTypeResult(checkType) as T
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
