import {inject, injectable} from "inversify"
import {EventType} from "../../event/enum/eventType"
import {createRoomMessageEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import EventService from "../../event/service/eventService"
import {ItemEntity} from "../../item/entity/itemEntity"
import ResponseMessageBuilder from "../../messageExchange/builder/responseMessageBuilder"
import {MobEntity} from "../../mob/entity/mobEntity"
import DeathEvent from "../../mob/event/deathEvent"
import MobService from "../../mob/service/mobService"
import {RoomEntity} from "../../room/entity/roomEntity"
import {Types} from "../../support/types"

@injectable()
export default class AutoLootCorpseEventConsumer implements EventConsumer {
  constructor(
    @inject(Types.EventService) private readonly eventService: EventService,
    @inject(Types.MobService) private readonly mobService: MobService) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobDeath ]
  }

  public async isEventConsumable(event: DeathEvent): Promise<boolean> {
    const death = event.death
    const winner = death.killer
    return !!winner && winner.isPlayerMob() && winner.playerMob.autoLoot
  }

  public async consume(event: DeathEvent): Promise<EventResponse> {
    const death = event.death
    const winner = death.killer as MobEntity
    const corpse = death.corpse
    const location = this.mobService.getLocationForMob(event.death.mobKilled)
    this.transferGoldFromCorpse(location.room, winner, corpse)
    await this.transferItemsFromCorpse(location.room, winner, corpse)
    return EventResponse.none(event)
  }

  private async transferItemsFromCorpse(room: RoomEntity, mob: MobEntity, corpse: ItemEntity) {
    return Promise.all(corpse.container.inventory.items.map(async item => {
      mob.inventory.addItem(item)
      await this.eventService.publish(createRoomMessageEvent(
        room,
        new ResponseMessageBuilder(mob, "{requestCreator} {verb} {item} from {corpse}.")
          .addReplacementForRequestCreator("verb", "loot")
          .addReplacementForTarget("verb", "loots")
          .addReplacement("item", item.toString())
          .addReplacement("corpse", corpse.toString())
          .create()))
    }))
  }

  private transferGoldFromCorpse(room: RoomEntity, mob: MobEntity, corpse: ItemEntity) {
    const followers = this.mobService.getFollowers(mob)
    if (mob.playerMob.autoSplit && corpse.container.gold > 0 && followers) {
      const mobsToSplit = []
      for (const groupMob of followers) {
        const location = this.mobService.getLocationForMob(groupMob)
        if (location.room === room) {
          mobsToSplit.push(groupMob)
        }
      }
      mobsToSplit.push(mob)
      const amount = corpse.container.gold / mobsToSplit.length
      corpse.container.gold = 0
      for (const groupMob of mobsToSplit) {
        groupMob.gold += amount
      }
    } else if (corpse.container.gold > 0) {
      mob.gold += corpse.container.gold
      corpse.container.gold = 0
    }
  }
}
