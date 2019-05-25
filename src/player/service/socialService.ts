import {ConditionMessages} from "../../action/constants"
import CheckBuilder from "../../check/builder/checkBuilder"
import Check from "../../check/check"
import CheckBuilderFactory from "../../check/factory/checkBuilderFactory"
import {Channel} from "../../client/enum/channel"
import {createSocialEvent} from "../../event/factory/eventFactory"
import EventService from "../../event/service/eventService"
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
    await this.eventService.publish(createSocialEvent(
      mob,
      Channel.Gossip,
      `${mob.name} gossips, "${message}"`))
  }

  public async say(mob: Mob, message: string) {
    await this.eventService.publish(createSocialEvent(
      mob,
      Channel.Say,
      `${mob.name} says, "${message}"`))
  }

  public async tell(mob: Mob, target: Mob, message: string) {
    await this.eventService.publish(createSocialEvent(
      mob,
      Channel.Tell,
      `${mob.name} tells you, "${message}"`,
      target))
  }
}
