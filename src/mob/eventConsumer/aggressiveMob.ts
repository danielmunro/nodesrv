import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {MobEntity} from "../entity/mobEntity"
import MobMoveEvent from "../event/mobMoveEvent"
import FightBuilder from "../fight/fightBuilder"
import LocationService from "../service/locationService"
import MobService from "../service/mobService"

export default class AggressiveMob implements EventConsumer {
  constructor(
    private readonly mobService: MobService,
    private readonly locationService: LocationService,
    private readonly fightBuilder: FightBuilder) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobMoved ]
  }

  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    if (event.mob.playerMob) {
      this.checkForAggressiveMobs(event.mob)
    }
    return EventResponse.none(event)
  }

  private checkForAggressiveMobs(mob: MobEntity) {
    const location = this.locationService.getLocationForMob(mob)
    const mobs = this.locationService.getMobsByRoom(location.room).filter(m => m !== mob)
    mobs.forEach(m => {
      if (m.traits.aggressive && m.level >= mob.level) {
        this.mobService.addFight(this.fightBuilder.create(m, mob))
      }
    })
  }
}
