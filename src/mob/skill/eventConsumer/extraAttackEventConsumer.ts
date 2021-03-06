import {inject, injectable, multiInject, unmanaged} from "inversify"
import Skill from "../../../action/impl/skill"
import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/interface/eventConsumer"
import EventResponse from "../../../event/messageExchange/eventResponse"
import EventContext from "../../../messageExchange/context/eventContext"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import {Types} from "../../../support/types"
import FightEvent from "../../fight/event/fightEvent"
import LocationService from "../../service/locationService"
import {SkillType} from "../skillType"

@injectable()
export default abstract class ExtraAttackEventConsumer implements EventConsumer {
  private readonly skill: Skill

  protected constructor(
    @inject(Types.LocationService) private readonly locationService: LocationService,
    @multiInject(Types.Skills) skills: Skill[],
    @unmanaged() skillType: SkillType) {
    this.skill = skills.find(skill => skill.getSkillType() === skillType) as Skill
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.AttackRound ]
  }

  public async isEventConsumable(event: FightEvent): Promise<boolean> {
    return !!event.mob.skills.find(skill => skill.skillType === this.skill.getSkillType())
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const fight = event.fight
    const room = this.locationService.getRoomForMob(event.mob)
    const result = await this.skill.handle(
      new Request(event.mob, room, { requestType: RequestType.Noop , event } as EventContext))
    if (result.isSuccessful()) {
      event.attacks.push(await fight.createAttack(event.mob, fight.getOpponentFor(event.mob)))
    }
    return EventResponse.none(event)
  }
}
