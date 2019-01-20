import {AffectType} from "../../../affect/affectType"
import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import TimeService from "../../../gameService/timeService"
import ItemService from "../../../item/itemService"
import {onlyLiving} from "../../../mob/enum/disposition"
import LocationService from "../../../mob/locationService"
import {Mob} from "../../../mob/model/mob"
import getSight from "../../../mob/race/sight"
import {Region} from "../../../region/model/region"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import ResponseBuilder from "../../../request/responseBuilder"
import match from "../../../support/matcher/match"
import Action from "../../action"
import {NOT_FOUND} from "../../constants"
import {MESSAGE_LOOK_CANNOT_SEE} from "../../constants"

export default class LookAction extends Action {
  constructor(
    private readonly locationService: LocationService,
    private readonly itemService: ItemService,
    private readonly timeService: TimeService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const room = request.getRoom()

    if (request.mob.getAffect(AffectType.Blind)) {
      return Check.fail(MESSAGE_LOOK_CANNOT_SEE)
    }

    if (this.somethingIsGlowing(request)) {
      return Check.ok()
    }

    const ableToSee = this.isAbleToSee(request.mob, room.region)

    if (!ableToSee) {
      return Check.fail(MESSAGE_LOOK_CANNOT_SEE)
    }

    return Check.ok()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const builder = checkedRequest.respondWith()
    const request = checkedRequest.request

    if (request.getContextAsInput().subject) {
      return this.lookAtSubject(request, builder)
    }

    const location = this.locationService.getLocationForMob(request.mob)
    const room = location.room

    return builder.info(
      room.toString()
      + this.reduceMobs(request.mob, this.locationService.getMobsByRoom(room))
      + room.inventory.toString("is here."))
  }

  protected getRequestType(): RequestType {
    return RequestType.Look
  }

  protected reduceMobs(mob: Mob, mobs: Mob[]): string {
    return mobs.filter(onlyLiving).reduce((previous: string, current: Mob) =>
      previous + (current !== mob ? "\n" + current.brief : ""), "")
  }

  protected lookAtSubject(request: Request, builder: ResponseBuilder) {
    const mob = this.locationService
      .getMobsByRoom(request.room)
      .find(m => match(m.name, request.getSubject()))
    if (mob) {
      return builder.info(mob.describe())
    }

    const subject = request.getContextAsInput().subject

    let item = this.itemService.findItem(request.getRoom().inventory, subject)
    if (item) {
      return builder.info(item.describe())
    }

    item = this.itemService.findItem(request.mob.inventory, subject)
    if (item) {
      return builder.info(item.describe())
    }

    return builder.error(NOT_FOUND)
  }

  protected somethingIsGlowing(request: Request) {
    return request.mob.equipped.find(this.isGlowingAffect)
      || request.room.inventory.find(this.isGlowingAffect)
  }

  protected isGlowingAffect(item) {
    return item.affects.find(affect => affect.affectType === AffectType.Glow)
  }

  protected isAbleToSee(mob: Mob, region: Region = null) {
    if (!region) {
      return true
    }
    return getSight(mob.race)
      .isAbleToSee(this.timeService.getCurrentTime(), region.terrain, region.weather)
  }
}
