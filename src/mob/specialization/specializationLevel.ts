import {SkillType} from "../../skill/skillType"
import {SpellType} from "../../spell/spellType"
import Customization from "./customization"
import {SpecializationType} from "./enum/specializationType"

export default class SpecializationLevel implements Customization {
  constructor(
    public readonly specialization: SpecializationType,
    public readonly abilityType: SkillType | SpellType,
    public readonly minimumLevel: number,
    public readonly creationPoints: number = 0,
  ) {}

  public getName(): string {
    return this.abilityType.toString()
  }

  public getCreationPoints(): number {
    return this.creationPoints
  }
}
