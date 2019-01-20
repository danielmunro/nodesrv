import { ActionType } from "../action/enum/actionType"
import {AffectType} from "../affect/affectType"
import Cost from "../check/cost/cost"
import { DamageType } from "../damage/damageType"
import { improveSpell } from "../improve/improve"
import SpecializationLevel from "../mob/specialization/specializationLevel"
import Skill from "../skill/skill"
import { SkillType } from "../skill/skillType"
import Spell from "../spell/spell"
import { SpellType } from "../spell/spellType"
import GameService from "./gameService"

export default class DefinitionService {
  constructor(private readonly gameService: GameService) {}

  public skill(
    skillType: SkillType,
    action,
    precondition,
    skillLevels: SpecializationLevel[],
    actionType: ActionType,
    costs: Cost[] = [],
    affectType: AffectType = null) {
    return new Skill(
      this.gameService,
      skillType,
      action,
      precondition,
      skillLevels,
      actionType,
      costs,
      affectType)
  }

  /*tslint:disable*/
  public spell(
    spellType: SpellType,
    actionType: ActionType,
    action, precondition,
    minimumManaCost: number,
    spellLevels: SpecializationLevel[],
    affectType: AffectType = null,
    damageType: DamageType = null) {
    return new Spell(
      this.gameService,
      spellType,
      actionType,
      precondition,
      improveSpell(action),
      minimumManaCost,
      spellLevels,
      affectType,
      damageType)
  }
}
