import { SkillType } from "../../skill/skillType"
import { RaceType } from "./raceType"

export default class Skill {
  constructor(
    public readonly race: RaceType,
    public readonly skillType: SkillType) {}
}
