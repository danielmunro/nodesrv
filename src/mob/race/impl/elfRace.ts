import AttributeBuilder from "../../../attributes/builder/attributeBuilder"
import {Vulnerability} from "../../enum/vulnerability"
import {createDamageModifier} from "../../fight/damageModifier"
import {DamageType} from "../../fight/enum/damageType"
import {SkillType} from "../../skill/skillType"
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
      createDamageModifier(DamageType.Magic, Vulnerability.Resist),
      createDamageModifier(DamageType.Electric, Vulnerability.Vulnerable)])
    .setPreferredSpecializations([
      SpecializationType.Ranger,
      SpecializationType.Mage,
    ])
    .setAttributes(
      new AttributeBuilder()
        .setStats(-1, 2, 2, 1, -1, 0)
        .build())
    .setStartingSkills([
      SkillType.Dodge,
    ])
    .setCreationPoints(7)
    .create()
}
