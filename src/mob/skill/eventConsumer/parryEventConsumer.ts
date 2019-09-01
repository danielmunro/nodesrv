import {injectable, multiInject} from "inversify"
import Skill from "../../../action/impl/skill"
import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/interface/eventConsumer"
import EventResponse from "../../../event/messageExchange/eventResponse"
import {Equipment} from "../../../item/enum/equipment"
import EventContext from "../../../messageExchange/context/eventContext"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import {Types} from "../../../support/types"
import FightEvent from "../../fight/event/fightEvent"
import {SkillType} from "../skillType"

@injectable()
export default class ParryEventConsumer implements EventConsumer {
  private readonly skill: Skill

  constructor(@multiInject(Types.Skills) skills: Skill[]) {
    this.skill = skills.find(skill => skill.getSkillType() === SkillType.Parry) as Skill
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.AttackRoundStart ]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const target = event.fight.getOpponentFor(event.mob)
    if (!target.skills.find(skill => skill.skillType === SkillType.Parry)
      || !target.equipped.items.find(item => item.equipment === Equipment.Weapon)) {
      return EventResponse.none(event)
    }
    const request = new Request(target, event.fight.room, { requestType: RequestType.Noop } as EventContext)
    const result = await this.skill.handle(request)
    if (result.isSuccessful()) {
      return EventResponse.satisfied(event, SkillType.Parry)
    }
    return EventResponse.none(event)
  }
}
