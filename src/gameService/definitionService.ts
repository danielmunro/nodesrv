import { ActionType } from "../action/enum/actionType"
import {AffectType} from "../affect/affectType"
import { DamageType } from "../damage/damageType"
import SpecializationLevel from "../mob/specialization/specializationLevel"
import Spell from "../spell/spell"
import { SpellType } from "../spell/spellType"
import GameService from "./gameService"

export default class DefinitionService {
  constructor(private readonly gameService: GameService) {}

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
      action,
      minimumManaCost,
      spellLevels,
      affectType,
      damageType)
  }
}
