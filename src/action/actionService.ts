import {inject, injectable} from "inversify"
import {Types} from "../support/types"
import Action from "./action"
import HelpAction from "./impl/info/helpAction"
import Skill from "./impl/skill"
import Spell from "./impl/spell"

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
