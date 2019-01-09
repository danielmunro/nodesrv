import { ActionType } from "../action/actionType"
import { Definition } from "../action/definition/definition"
import {AffectType} from "../affect/affectType"
import Cost from "../check/cost/cost"
import { DamageType } from "../damage/damageType"
import { improveSpell } from "../improve/improve"
import SpecializationLevel from "../mob/specialization/specializationLevel"
import { RequestType } from "../request/requestType"
import SkillDefinition from "../skill/skillDefinition"
import { SkillType } from "../skill/skillType"
import SpellDefinition from "../spell/spellDefinition"
import { SpellType } from "../spell/spellType"
import GameService from "./gameService"

export default class DefinitionService {
  constructor(private readonly gameService: GameService) {}

  public action(requestType: RequestType, action, precondition = null): Definition {
    return new Definition(this.gameService, requestType, action, precondition)
  }

  public skill(
    skillType: SkillType,
    action,
    precondition,
    skillLevels: SpecializationLevel[],
    actionType: ActionType,
    costs: Cost[] = [],
    affectType: AffectType = null) {
    return new SkillDefinition(
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
    return new SpellDefinition(
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
