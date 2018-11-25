import { ActionType } from "../action/actionType"
import { Definition } from "../action/definition/definition"
import { DamageType } from "../damage/damageType"
import { improveSkill, improveSpell } from "../improve/improve"
import { Trigger } from "../mob/enum/trigger"
import { RequestType } from "../request/requestType"
import SkillDefinition from "../skill/skillDefinition"
import { SkillType } from "../skill/skillType"
import SpellDefinition from "../spell/spellDefinition"
import { SpellType } from "../spell/spellType"
import GameService from "./gameService"

export default class DefinitionService {
  constructor(private gameService: GameService) {}

  public action(requestType: RequestType, action, precondition = null): Definition {
    return new Definition(this.gameService, requestType, action, precondition)
  }

  public skill(skillType: SkillType, trigger: Trigger, action, precondition = null) {
    return new SkillDefinition(this.gameService, skillType, [trigger], improveSkill(action), precondition)
  }

  public spell(
    spellType: SpellType, actionType: ActionType, action, precondition, damageType: DamageType = null) {
    return new SpellDefinition(this.gameService, spellType, actionType, precondition, improveSpell(action), damageType)
  }
}
