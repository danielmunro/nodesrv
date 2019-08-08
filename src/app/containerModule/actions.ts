import {ContainerModule} from "inversify"
import Action from "../../action/impl/action"
import Skill from "../../action/impl/skill"
import weaponAction from "../../action/impl/skill/weaponAction"
import Spell from "../../action/impl/spell"
import CheckBuilderFactory from "../../check/factory/checkBuilderFactory"
import AbilityService from "../../check/service/abilityService"
import EventService from "../../event/service/eventService"
import StateService from "../../gameService/stateService"
import ItemService from "../../item/service/itemService"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import getSpellTable from "../../mob/spell/spellTable"
import {Types} from "../../support/types"
import {actions} from "./action/actionList"
import {multiActions} from "./action/multiActionList"
import {skillActions} from "./action/skillActionList"
import {skills} from "./action/skillList"
import {weapons} from "./action/weaponList"

export default new ContainerModule(bind => {
  actions.forEach(action => bind<Action>(Types.Actions).to(action))

  multiActions.forEach(multiAction => bind<Action>(Types.Actions).toDynamicValue(context =>
    multiAction(context.container.get<CheckBuilderFactory>(Types.CheckBuilderFactory))))

  skillActions.forEach(skillAction =>
    bind<Action>(Types.Actions).toDynamicValue(context =>
      skillAction(context.container.get<AbilityService>(Types.AbilityService))))

  skills.forEach(skill =>
    bind<Skill>(Types.Skills).toDynamicValue(context =>
      skill(context.container.get<AbilityService>(Types.AbilityService))))

  weapons.forEach(weapon =>
    bind<Skill>(Types.Skills).toDynamicValue(context =>
      weaponAction(context.container.get<AbilityService>(Types.AbilityService), weapon)))

  bind<Spell[]>(Types.Spells).toDynamicValue(context =>
    getSpellTable(
      context.container.get<MobService>(Types.MobService),
      context.container.get<EventService>(Types.EventService),
      context.container.get<ItemService>(Types.ItemService),
      context.container.get<StateService>(Types.StateService),
      context.container.get<LocationService>(Types.LocationService))).inSingletonScope()
})
