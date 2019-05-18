import {ConditionMessages} from "../../action/constants"
import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import CheckBuilderFactory from "../../check/checkBuilderFactory"
import {Channel} from "../../client/channel"
import SocialEvent from "../../client/event/socialEvent"
import EventService from "../../event/eventService"
import {isBanned} from "../../mob/enum/standing"
import {Mob} from "../../mob/model/mob"
import Request from "../../request/request"

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

  public async gossip(mob: Mob, message: string) {
    await this.eventService.publish(new SocialEvent(
      mob,
      Channel.Gossip,
      `${mob.name} gossips, "${message}"`))
  }

  public async say(mob: Mob, message: string) {
    await this.eventService.publish(new SocialEvent(
      mob,
      Channel.Say,
      `${mob.name} says, "${message}"`))
  }

  public async tell(mob: Mob, target: Mob, message: string) {
    await this.eventService.publish(new SocialEvent(
      mob,
      Channel.Tell,
      `${mob.name} tells you, "${message}"`,
      target))
  }
}
