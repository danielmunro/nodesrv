import {inject, injectable, multiInject} from "inversify"
import Skill from "../../../action/impl/skill"
import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/interface/eventConsumer"
import EventResponse from "../../../event/messageExchange/eventResponse"
import {Equipment} from "../../../item/enum/equipment"
import EventContext from "../../../messageExchange/context/eventContext"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import {RoomEntity} from "../../../room/entity/roomEntity"
import {Types} from "../../../support/types"
import {MobEntity} from "../../entity/mobEntity"
import FightEvent from "../../fight/event/fightEvent"
import LocationService from "../../service/locationService"
import {SkillType} from "../skillType"

@injectable()
export default class ShieldBlockEventConsumer implements EventConsumer {
  private static createRequest(mob: MobEntity, room: RoomEntity): Request {
    return new Request(mob, room, { requestType: RequestType.Noop } as EventContext)
  }

  private readonly skill: Skill

  constructor(
    @inject(Types.LocationService) private readonly locationService: LocationService,
    @multiInject(Types.Skills) skills: Skill[]) {
    this.skill = skills.find(skill => skill.getSkillType() === SkillType.ShieldBlock) as Skill
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.AttackRoundStart ]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const target = event.fight.getOpponentFor(event.mob)
    if (!target.getSkill(SkillType.ShieldBlock) || !target.getFirstEquippedItemAtPosition(Equipment.Shield)) {
      return EventResponse.none(event)
    }
    const room = this.locationService.getRoomForMob(event.mob)
    const result = await this.skill.handle(
      ShieldBlockEventConsumer.createRequest(target, room))
    if (result.isSuccessful()) {
      return EventResponse.satisfied(event, SkillType.ShieldBlock)
    }
    return EventResponse.none(event)
  }
}
