import {ContainerModule} from "inversify"
import Action from "../../action/impl/action"
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

  multiActions.forEach(multiAction => bind<Action>(Types.Actions).toDynamicValue(context =>
    multiAction(context.container.get<CheckBuilderFactory>(Types.CheckBuilderFactory))))

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
