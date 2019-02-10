import Action from "../action/action"
import Skill from "../action/skill"
import Spell from "../action/spell"

export default class ActionService {
  constructor(
    public readonly actions: Action[],
    public readonly skills: Skill[],
    public readonly spells: Spell[]) {
  }
}
