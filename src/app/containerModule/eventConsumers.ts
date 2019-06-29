import {ContainerModule} from "inversify"
import EventConsumer from "../../event/eventConsumer"
import EventService from "../../event/service/eventService"
import createEventConsumerTable from "../../event/table/eventConsumerTable"
import GameService from "../../gameService/gameService"
import ItemService from "../../item/service/itemService"
import FightBuilder from "../../mob/fight/fightBuilder"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import {GameServerService} from "../../server/service/gameServerService"
import {Types} from "../../support/types"
import {Timings} from "../constants"

export default new ContainerModule(bind => {
  console.time(Timings.eventConsumerTable)
  bind<EventConsumer[]>(Types.EventConsumerTable).toDynamicValue(context => createEventConsumerTable(
      context.container.get<GameService>(Types.GameService),
      context.container.get<GameServerService>(Types.GameServer),
      context.container.get<MobService>(Types.MobService),
      context.container.get<ItemService>(Types.ItemService),
      context.container.get<FightBuilder>(Types.FightBuilder),
      context.container.get<EventService>(Types.EventService),
      context.container.get<LocationService>(Types.LocationService))).inSingletonScope()
  console.timeEnd(Timings.eventConsumerTable)
})
