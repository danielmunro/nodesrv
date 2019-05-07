import {inject, injectable} from "inversify"
import Action from "../action/action"
import HelpAction from "../action/impl/info/helpAction"
import Skill from "../action/impl/skill"
import Spell from "../action/impl/spell"
import {Types} from "../support/types"

@injectable()
export default class ActionService {
  constructor(
    @inject(Types.Actions) public readonly actions: Action[],
    @inject(Types.Skills) public readonly skills: Skill[],
    @inject(Types.Spells) public readonly spells: Spell[]) {
    const helpAction = this.actions.find(action => action instanceof HelpAction) as HelpAction
    if (helpAction) {
      helpAction.setActions(this.actions)
    }
  }
}
