import {ContainerModule} from "inversify"
import Action from "../../action/impl/action"
import Skill from "../../action/impl/skill"
import Spell from "../../action/impl/spell"
import getActionTable from "../../action/table/actionTable"
import EventService from "../../event/service/eventService"
import StateService from "../../gameService/stateService"
import TimeService from "../../gameService/timeService"
import ItemService from "../../item/service/itemService"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import {getSkillTable} from "../../mob/skill/skillTable"
import getSpellTable from "../../mob/spell/spellTable"
import EscrowService from "../../mob/trade/escrowService"
import WeatherService from "../../region/service/weatherService"
import {Types} from "../../support/types"

export default new ContainerModule(bind => {
  bind<Action[]>(Types.Actions).toDynamicValue(context =>
    getActionTable(
      context.container.get<MobService>(Types.MobService),
      context.container.get<ItemService>(Types.ItemService),
      context.container.get<TimeService>(Types.TimeService),
      context.container.get<EventService>(Types.EventService),
      context.container.get<WeatherService>(Types.WeatherService),
      context.container.get<Spell[]>(Types.Spells),
      context.container.get<LocationService>(Types.LocationService),
      context.container.get<EscrowService>(Types.EscrowService))).inSingletonScope()
  bind<Skill[]>(Types.Skills).toDynamicValue(context =>
    getSkillTable(
      context.container.get<MobService>(Types.MobService),
      context.container.get<EventService>(Types.EventService))).inSingletonScope()
  bind<Spell[]>(Types.Spells).toDynamicValue(context =>
    getSpellTable(
      context.container.get<MobService>(Types.MobService),
      context.container.get<EventService>(Types.EventService),
      context.container.get<ItemService>(Types.ItemService),
      context.container.get<StateService>(Types.StateService),
      context.container.get<LocationService>(Types.LocationService))).inSingletonScope()
})
