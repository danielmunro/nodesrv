import { Race } from "./race"
import { SkillType } from "../../skill/skillType"

export default class Skill {
  constructor(
    public readonly race: Race,
    public readonly skillType: SkillType) {}
}
