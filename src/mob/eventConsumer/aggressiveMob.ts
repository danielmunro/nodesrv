import MobEvent from "../event/mobEvent"
import EventConsumer from "../../event/eventConsumer"
import {EventResponse} from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import FightBuilder from "../fight/fightBuilder"
import LocationService from "../locationService"
import MobService from "../mobService"
import {Mob} from "../model/mob"

export default class AggressiveMob implements EventConsumer {
  constructor(
    private readonly mobService: MobService,
    private readonly locationService: LocationService,
    private readonly fightBuilder: FightBuilder) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobArrived]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {
    this.checkForAggressiveMobs(event.mob)
    return Promise.resolve(EventResponse.None)
  }

  private checkForAggressiveMobs(mob: Mob) {
    const location = this.locationService.getLocationForMob(mob)
    const mobs = this.locationService.getMobsByRoom(location.room).filter(m => m !== mob)
    mobs.forEach(m => {
      if (m.traits.aggressive && m.level >= mob.level) {
        this.mobService.addFight(this.fightBuilder.create(m, mob))
      }
    })
  }
}
