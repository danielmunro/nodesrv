import {inject, injectable, multiInject} from "inversify"
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
export default class DodgeEventConsumer implements EventConsumer {
  private readonly skill: Skill

  constructor(
    @inject(Types.LocationService) private readonly locationService: LocationService,
    @multiInject(Types.Skills) skills: Skill[]) {
    this.skill = skills.find(skill => skill.getSkillType() === SkillType.Dodge) as Skill
  }

  public getConsumingEventTypes(): EventType[] {
    return [EventType.AttackRoundStart]
  }

  public async isEventConsumable(event: FightEvent): Promise<boolean> {
    return !!event.mob.getSkill(SkillType.Dodge)
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const room = this.locationService.getRoomForMob(event.mob)
    const result = await this.skill.handle(
      new Request(event.mob, room, { requestType: RequestType.Noop } as EventContext))
    if (result.isSuccessful()) {
      return EventResponse.satisfied(event, SkillType.Dodge)
    }
    return EventResponse.none(event)
  }
}
