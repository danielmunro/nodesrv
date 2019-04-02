import AttributeBuilder from "../../../attributes/attributeBuilder"
import {newStats} from "../../../attributes/factory"
import {DamageType} from "../../../damage/damageType"
import {SkillType} from "../../../skill/skillType"
import DamageModifier from "../../damageModifier"
import {Vulnerability} from "../../enum/vulnerability"
import {SpecializationType} from "../../specialization/specializationType"
import {Appetite} from "../enum/appetite"
import {Eyesight} from "../enum/eyesight"
import {RaceType} from "../enum/raceType"
import {Size} from "../enum/size"
import Race from "../race"
import RaceBuilder from "../raceBuilder"

export default function(): Race {
  return new RaceBuilder(RaceType.Dwarf)
    .setSize(Size.S)
    .setAppetite(Appetite.Large)
    .setSight(Eyesight.Good)
    .setDamageAbsorption([
      new DamageModifier(DamageType.Mental, Vulnerability.Vulnerable),
      new DamageModifier(DamageType.Poison, Vulnerability.Resist),
      new DamageModifier(DamageType.Bash, Vulnerability.Resist)])
    .setPreferredSpecializations([
      SpecializationType.Warrior,
      SpecializationType.Cleric,
    ])
    .setAttributes(
      new AttributeBuilder()
        .setStats(newStats(2, -2, 1, -1, 1, 0))
        .build())
    .setStartingSkills([
      SkillType.Axe,
      SkillType.Berserk,
    ])
    .create()
}
