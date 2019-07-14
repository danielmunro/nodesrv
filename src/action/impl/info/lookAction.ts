import {AffectType} from "../../../affect/enum/affectType"
import Check from "../../../check/check"
import TimeService from "../../../gameService/timeService"
import {ItemEntity} from "../../../item/entity/itemEntity"
import ItemService from "../../../item/service/itemService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {onlyLiving} from "../../../mob/enum/disposition"
import {isAbleToSee} from "../../../mob/race/sight"
import LocationService from "../../../mob/service/locationService"
import {RegionEntity} from "../../../region/entity/regionEntity"
import {Weather} from "../../../region/enum/weather"
import WeatherService from "../../../region/service/weatherService"
import ResponseBuilder from "../../../request/builder/responseBuilder"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import match from "../../../support/matcher/match"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class LookAction extends Action {
  constructor(
    private readonly locationService: LocationService,
    private readonly itemService: ItemService,
    private readonly timeService: TimeService,
    private readonly weatherService: WeatherService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    if (request.mob.affect().isBlind()) {
      return Check.fail(Messages.Look.Fail)
    }

    if (this.somethingIsGlowing(request)) {
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
      + request.getRoom().inventory.toString("is here."))
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

  protected reduceMobs(mob: MobEntity, mobs: MobEntity[]): string {
    return mobs.filter(onlyLiving)
      .filter(m => mob.canSee(m))
      .reduce((previous: string, current: MobEntity) =>
        previous + (current !== mob ? "\n" + current.look() : ""), "")
  }

  protected lookAtSubject(request: Request, builder: ResponseBuilder) {
    const subject = request.getSubject()
    const mob = this.locationService
      .getMobsByRoom(request.getRoom())
      .find(m => match(m.name, subject))

    if (mob && request.mob.canSee(mob)) {
      return builder.info(mob.describe())
    }

    let item = request.findItemInRoomInventory()
    if (item && request.mob.canSee(item)) {
      return builder.info(item.describe())
    }

    item = this.itemService.findItem(request.mob.inventory, subject)
    if (item && request.mob.canSee(item)) {
      return builder.info(item.describe())
    }

    return builder.error(Messages.Look.NotFound)
  }

  protected isAbleToSee(mob: MobEntity, region: RegionEntity) {
    return isAbleToSee(
      mob.race().sight,
      this.timeService.getCurrentTime(),
      region.terrain,
      this.weatherService.getWeatherForRegion(region)
        .or(() => Weather.Clear)
        .get())
  }

  private somethingIsGlowing(request: Request) {
    return request.mob.equipped.find((item: ItemEntity) => item.affect().has(AffectType.Glow))
      || request.getRoom().inventory.find((item: ItemEntity) => item.affect().has(AffectType.Glow))
  }
}
