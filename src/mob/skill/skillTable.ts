import {Container} from "inversify"
import Skill from "../../action/impl/skill"
import {Types} from "../../support/types"

export function getSkillTable(container: Container): Skill[] {
  return container.getAll<Skill>(Types.Skills)
}
