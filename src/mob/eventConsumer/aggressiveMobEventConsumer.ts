import { inject, injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {Types} from "../../support/types"
import {MobEntity} from "../entity/mobEntity"
import MobMoveEvent from "../event/mobMoveEvent"
import FightBuilder from "../fight/fightBuilder"
import LocationService from "../service/locationService"
import MobService from "../service/mobService"

@injectable()
export default class AggressiveMobEventConsumer implements EventConsumer {
  constructor(
    @inject(Types.MobService) private readonly mobService: MobService,
    @inject(Types.LocationService) private readonly locationService: LocationService,
    @inject(Types.FightBuilder) private readonly fightBuilder: FightBuilder) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobMoved ]
  }

  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    if (event.mob.isPlayerMob()) {
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
