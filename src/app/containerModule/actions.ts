import {ContainerModule} from "inversify"
import Action from "../../action/impl/action"
import FleeAction from "../../action/impl/fight/fleeAction"
import LookAction from "../../action/impl/info/lookAction"
import DownAction from "../../action/impl/move/downAction"
import EastAction from "../../action/impl/move/eastAction"
import NorthAction from "../../action/impl/move/northAction"
import SouthAction from "../../action/impl/move/southAction"
import UpAction from "../../action/impl/move/upAction"
import WestAction from "../../action/impl/move/westAction"
import Skill from "../../action/impl/skill"
import weaponAction from "../../action/impl/skill/weaponAction"
import Spell from "../../action/impl/spell"
import CheckBuilderFactory from "../../check/factory/checkBuilderFactory"
import AbilityService from "../../check/service/abilityService"
import {Types} from "../../support/types"
import {actions} from "./action/actionList"
import {multiActions} from "./action/multiActionList"
import {skillActions} from "./action/skillActionList"
import {skills} from "./action/skillList"
import {spells} from "./action/spellList"
import {weapons} from "./action/weaponList"

export default new ContainerModule(bind => {
  actions.forEach(action => bind<Action>(Types.Actions).to(action))

  // actions needed by other dependencies
  bind<Action>(Types.FleeAction).to(FleeAction)
  bind<Action>(Types.LookAction).to(LookAction)
  bind<Action>(Types.MoveActions).to(NorthAction)
  bind<Action>(Types.MoveActions).to(SouthAction)
  bind<Action>(Types.MoveActions).to(EastAction)
  bind<Action>(Types.MoveActions).to(WestAction)
  bind<Action>(Types.MoveActions).to(UpAction)
  bind<Action>(Types.MoveActions).to(DownAction)

  multiActions.forEach(multiAction => bind<Action>(Types.Actions).toDynamicValue(context =>
    multiAction(context.container.get<CheckBuilderFactory>(Types.CheckBuilderFactory), context.container)))

  skillActions.forEach(skillAction =>
    bind<Action>(Types.Actions).toDynamicValue(context =>
      skillAction(context.container.get<AbilityService>(Types.AbilityService))))

  skills.forEach(skill =>
    bind<Skill>(Types.Skills).toDynamicValue(context =>
      skill(context.container.get<AbilityService>(Types.AbilityService))))

  spells.forEach(spell =>
    bind<Spell>(Types.Spells).toDynamicValue(context =>
    spell(context.container.get<AbilityService>(Types.AbilityService))))

  weapons.forEach(weapon =>
    bind<Skill>(Types.Skills).toDynamicValue(context =>
      weaponAction(context.container.get<AbilityService>(Types.AbilityService), weapon)))
})
