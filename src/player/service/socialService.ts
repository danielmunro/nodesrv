import {inject, injectable} from "inversify"
import {ConditionMessages} from "../../action/constants"
import {ActionPart} from "../../action/enum/actionPart"
import CheckBuilder from "../../check/builder/checkBuilder"
import Check from "../../check/check"
import CheckBuilderFactory from "../../check/factory/checkBuilderFactory"
import {Channel} from "../../client/enum/channel"
import {createSocialEvent} from "../../event/factory/eventFactory"
import EventService from "../../event/service/eventService"
import Request from "../../messageExchange/request"
import {MobEntity} from "../../mob/entity/mobEntity"
import {isBanned} from "../../mob/enum/standing"
import {Types} from "../../support/types"

@injectable()
export default class SocialService {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.EventService) private readonly eventService: EventService) {}

  public async createSocialCheck(request: Request, actionParts: ActionPart[]): Promise<Check> {
    return (await this.getSocialCheck(request, actionParts)).create()
  }

  public async getSocialCheck(request: Request, actionParts: ActionPart[]): Promise<CheckBuilder> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(request, actionParts)
      .require(!isBanned(request.mob.getStanding()), ConditionMessages.Social.LackingStanding)
  }

  public async gossip(mob: MobEntity, message: string) {
    await this.eventService.publish(createSocialEvent(
      mob,
      Channel.Gossip,
      `${mob.name} gossips, "${message}"`))
  }

  public async say(mob: MobEntity, message: string) {
    await this.eventService.publish(createSocialEvent(
      mob,
      Channel.Say,
      `${mob.name} says, "${message}"`))
  }

  public async tell(mob: MobEntity, target: MobEntity, message: string) {
    await this.eventService.publish(createSocialEvent(
      mob,
      Channel.Tell,
      `${mob.name} tells you, "${message}"`,
      target))
  }

  public async groupTell(mob: MobEntity, target: MobEntity, message: string) {
    await this.eventService.publish(createSocialEvent(
      mob,
      Channel.GroupTell,
      `${mob.name} tells the group, "${message}"`,
      target))
  }
}
