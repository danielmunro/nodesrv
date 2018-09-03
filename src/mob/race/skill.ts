import { SkillType } from "../../skill/skillType"
import { Race } from "./race"

export default class Skill {
  constructor(
    public readonly race: Race,
    public readonly skillType: SkillType) {}
}
