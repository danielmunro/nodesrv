import AttributeBuilder from "../../../attributes/attributeBuilder"
import {newStats} from "../../../attributes/factory"
import {SkillType} from "../../../skill/skillType"
import {Vulnerability} from "../../enum/vulnerability"
import DamageModifier from "../../fight/damageModifier"
import {DamageType} from "../../fight/damageType"
import {SpecializationType} from "../../specialization/enum/specializationType"
import {Appetite} from "../enum/appetite"
import {Eyesight} from "../enum/eyesight"
import {RaceType} from "../enum/raceType"
import {Size} from "../enum/size"
import Race from "../race"
import RaceBuilder from "../raceBuilder"

export default function(): Race {
  return new RaceBuilder(RaceType.Elf)
    .setSize(Size.S)
    .setAppetite(Appetite.Small)
    .setSight(Eyesight.Excellent)
    .setDamageAbsorption([
      new DamageModifier(DamageType.Magic, Vulnerability.Resist),
      new DamageModifier(DamageType.Electric, Vulnerability.Vulnerable)])
    .setPreferredSpecializations([
      SpecializationType.Ranger,
      SpecializationType.Mage,
    ])
    .setAttributes(
      new AttributeBuilder()
        .setStats(newStats(-1, 2, 2, 1, -1, 0))
        .build())
    .setStartingSkills([
      SkillType.Dodge,
    ])
    .create()
}
