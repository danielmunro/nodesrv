import {injectable, multiInject} from "inversify"
import Skill from "../../../action/impl/skill"
import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/interface/eventConsumer"
import EventResponse from "../../../event/messageExchange/eventResponse"
import EventContext from "../../../messageExchange/context/eventContext"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import {Types} from "../../../support/types"
import TickEvent from "../../event/tickEvent"
import FightEvent from "../../fight/event/fightEvent"
import {SkillType} from "../skillType"

@injectable()
export default class FastHealingEventConsumer implements EventConsumer {
  private readonly skill: Skill

  constructor(@multiInject(Types.Skills) skills: Skill[]) {
    this.skill = skills.find(skill => skill.getSkillType() === SkillType.FastHealing) as Skill
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Tick ]
  }

  public async isEventConsumable(event: FightEvent): Promise<boolean> {
    return !!event.mob.getSkill(SkillType.FastHealing)
  }

  public async consume(event: TickEvent): Promise<EventResponse> {
    const request = new Request(event.mob, event.room, {requestType: RequestType.Noop } as EventContext)
    await this.skill.handle(request)
    return EventResponse.none(event)
  }
}
