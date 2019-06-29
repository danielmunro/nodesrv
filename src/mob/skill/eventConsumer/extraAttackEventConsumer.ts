import Skill from "../../../action/impl/skill"
import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/eventConsumer"
import EventResponse from "../../../event/eventResponse"
import {MobEntity} from "../../entity/mobEntity"
import FightEvent from "../../fight/event/fightEvent"
import EventContext from "../../../request/context/eventContext"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"

export default class ExtraAttackEventConsumer implements EventConsumer {
  constructor(private readonly skill: Skill) {}

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
      event.attacks.push(await fight.attack(event.mob, fight.getOpponentFor(event.mob) as MobEntity))
    }
    return EventResponse.none(event)
  }
}
