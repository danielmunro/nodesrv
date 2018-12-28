import EventConsumer from "../../event/eventConsumer"
import {EventResponseStatus} from "../../event/eventResponseStatus"
import {EventType} from "../../event/eventType"
import MobEvent from "../event/mobEvent"
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

  public async consume(event: MobEvent): Promise<EventResponseStatus> {
    this.checkForAggressiveMobs(event.mob)
    return Promise.resolve(EventResponseStatus.None)
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
