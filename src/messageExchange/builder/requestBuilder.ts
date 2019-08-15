import {MobEntity} from "../../mob/entity/mobEntity"
import LocationService from "../../mob/service/locationService"
import {RoomEntity} from "../../room/entity/roomEntity"
import match from "../../support/matcher/match"
import InputContext from "../context/inputContext"
import {RequestType} from "../enum/requestType"
import Request from "../request"

export default class RequestBuilder {
  constructor(
    private readonly locationService: LocationService,
    private readonly mob: MobEntity,
    private readonly room?: RoomEntity) {}

  public create(requestType: RequestType, input: string = requestType.toString()): Request {
    return new Request(
      this.mob,
      this.room as RoomEntity,
      new InputContext(requestType, input),
      this.getTargetFromRequest(input))
  }

  private getTargetFromRequest(input: string): MobEntity | undefined {
    const words = input.split(" ")
    const word = words[words.length - 1]
    return this.locationService
      .getMobsByRoom(this.room as RoomEntity)
      .find((mob: MobEntity) => match(mob.name, word))
  }
}
