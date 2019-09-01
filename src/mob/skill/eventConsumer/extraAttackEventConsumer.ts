import {injectable, multiInject, unmanaged} from "inversify"
import Skill from "../../../action/impl/skill"
import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/interface/eventConsumer"
import EventResponse from "../../../event/messageExchange/eventResponse"
import EventContext from "../../../messageExchange/context/eventContext"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import {Types} from "../../../support/types"
import FightEvent from "../../fight/event/fightEvent"
import {SkillType} from "../skillType"

@injectable()
export default abstract class ExtraAttackEventConsumer implements EventConsumer {
  private readonly skill: Skill

  protected constructor(@multiInject(Types.Skills) skills: Skill[], @unmanaged() skillType: SkillType) {
    this.skill = skills.find(skill => skill.getSkillType() === skillType) as Skill
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.AttackRound ]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    if (!event.mob.skills.find(skill => skill.skillType === this.skill.getSkillType())) {
      return EventResponse.none(event)
    }
    const fight = event.fight
    const result = await this.skill.handle(
      new Request(event.mob, fight.room, { requestType: RequestType.Noop , event } as EventContext))
    if (result.isSuccessful()) {
      event.attacks.push(await fight.attack(event.mob, fight.getOpponentFor(event.mob)))
    }
    return EventResponse.none(event)
  }
}
