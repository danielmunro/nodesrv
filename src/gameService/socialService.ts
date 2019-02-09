import {ConditionMessages} from "../action/constants"
import Check from "../check/check"
import CheckBuilder from "../check/checkBuilder"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import CheckedRequest from "../check/checkedRequest"
import {CheckType} from "../check/checkType"
import {Channel} from "../client/channel"
import SocialEvent from "../client/event/socialEvent"
import EventService from "../event/eventService"
import {isBanned} from "../mob/enum/standing"
import {Request} from "../request/request"

export default class SocialService {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {}

  public async createSocialCheck(request: Request): Promise<Check> {
    return (await this.getSocialCheck(request)).create()
  }

  public async getSocialCheck(request: Request): Promise<CheckBuilder> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(!isBanned(request.mob.getStanding()), ConditionMessages.Social.LackingStanding)
  }

  public async gossip(checkedRequest: CheckedRequest) {
    const request = checkedRequest.request
    const message = request.getContextAsInput().message
    await this.eventService.publish(new SocialEvent(
      request.mob,
      Channel.Gossip,
      `${request.mob.name} gossips, "${message}"`))
  }

  public async say(checkedRequest: CheckedRequest) {
    const request = checkedRequest.request
    await this.eventService.publish(new SocialEvent(
      request.mob,
      Channel.Say,
      `${request.mob.name} says, "${request.getContextAsInput().message}"`))
  }

  public async tell(checkedRequest: CheckedRequest) {
    const request = checkedRequest.request
    const message = request.getContextAsInput().words.slice(2).join(" ")
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    await this.eventService.publish(new SocialEvent(
      checkedRequest.mob,
      Channel.Tell,
      `${checkedRequest.mob.name} tells you, "${message}"`,
      target))

    return request.respondWith().success(`You tell ${target.name}, "${message}"`)
  }
}
