import { RequestType } from "../request/requestType"
import { Definition } from "../action/definition/definition"
import { SkillType } from "../skill/skillType"
import { Trigger } from "../mob/enum/trigger"
import SkillDefinition from "../skill/skillDefinition"
import { improveSkill, improveSpell } from "../improve/improve"
import { SpellType } from "../spell/spellType"
import { ActionType } from "../action/actionType"
import { DamageType } from "../damage/damageType"
import SpellDefinition from "../spell/spellDefinition"
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
