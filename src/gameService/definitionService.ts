import { ActionType } from "../action/actionType"
import { Definition } from "../action/definition/definition"
import { DamageType } from "../damage/damageType"
import { improveSpell } from "../improve/improve"
import { Trigger } from "../mob/enum/trigger"
import { RequestType } from "../request/requestType"
import SkillDefinition from "../skill/skillDefinition"
import { SkillType } from "../skill/skillType"
import SpellDefinition from "../spell/spellDefinition"
import SpellLevel from "../spell/spellLevel"
import { SpellType } from "../spell/spellType"
import GameService from "./gameService"

export default class DefinitionService {
  constructor(private readonly gameService: GameService) {}

  public action(requestType: RequestType, action, precondition = null): Definition {
    return new Definition(this.gameService, requestType, action, precondition)
  }

  public skill(skillType: SkillType, trigger: Trigger, action, precondition = null) {
    return new SkillDefinition(this.gameService, skillType, [trigger], action, precondition)
  }

  public spell(
    spellType: SpellType,
    actionType: ActionType,
    action, precondition,
    minimumManaCost: number,
    spellLevels: SpellLevel[],
    damageType: DamageType = null) {
    return new SpellDefinition(
      this.gameService,
      spellType,
      actionType,
      precondition,
      improveSpell(action),
      minimumManaCost,
      spellLevels,
      damageType)
  }
}
