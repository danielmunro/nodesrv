import {AffectType} from "../../../affect/affectType"
import Check from "../../../check/check"
import TimeService from "../../../gameService/timeService"
import ItemService from "../../../item/itemService"
import {onlyLiving} from "../../../mob/enum/disposition"
import {Mob} from "../../../mob/model/mob"
import {isAbleToSee} from "../../../mob/race/sight"
import LocationService from "../../../mob/service/locationService"
import {Weather} from "../../../region/enum/weather"
import {Region} from "../../../region/model/region"
import WeatherService from "../../../region/weatherService"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import ResponseBuilder from "../../../request/responseBuilder"
import Maybe from "../../../support/functional/maybe"
import match from "../../../support/matcher/match"
import Action from "../../action"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class LookAction extends Action {
  constructor(
    private readonly locationService: LocationService,
    private readonly itemService: ItemService,
    private readonly timeService: TimeService,
    private readonly weatherService: WeatherService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    if (request.mobAffects().isBlind()) {
      return Check.fail(Messages.Look.Fail)
    }

    if (request.somethingIsGlowing()) {
      return Check.ok()
    }

    const ableToSee = this.isAbleToSee(request.mob, request.getRoomRegion())

    if (!ableToSee) {
      return Check.fail(Messages.Look.Fail)
    }

    return Check.ok()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const builder = requestService.respondWith()
    const request = requestService.getRequest()

    if (requestService.getSubject()) {
      return this.lookAtSubject(request, builder)
    }

    return builder.info(
      request.getRoom().toString()
      + this.reduceMobs(requestService.getMob(), this.locationService.getMobsByRoom(request.getRoom()))
      + request.getRoom().inventory.toString("has here."))
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Thing ]
  }

  public getRequestType(): RequestType {
    return RequestType.Look
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  protected reduceMobs(mob: Mob, mobs: Mob[]): string {
    const aff = mob.affect()
    return mobs.filter(onlyLiving)
      .filter(m => !m.affect().has(AffectType.Invisible) || aff.has(AffectType.DetectInvisible))
      .filter(m => !m.affect().has(AffectType.Hidden) || aff.has(AffectType.DetectHidden))
      .reduce((previous: string, current: Mob) =>
        previous + (current !== mob ? "\n" + current.brief : ""), "")
  }

  protected lookAtSubject(request: Request, builder: ResponseBuilder) {
    const subject = request.getSubject()
    const mob = this.locationService
      .getMobsByRoom(request.getRoom())
      .find(m => match(m.name, subject))
    if (mob) {
      return builder.info(mob.describe())
    }

    let item = request.findItemInRoomInventory()
    if (item) {
      return builder.info(item.describe())
    }

    item = this.itemService.findItem(request.mob.inventory, subject)
    if (item) {
      return builder.info(item.describe())
    }

    return builder.error(Messages.Look.NotFound)
  }

  protected isAbleToSee(mob: Mob, region?: Region) {
    return new Maybe(region)
      .do((r: Region) =>
        isAbleToSee(
          mob.race().sight,
          this.timeService.getCurrentTime(),
          r.terrain,
          this.weatherService.getWeatherForRegion(r) as Weather))
      .or(() => true)
      .get()
  }
}
