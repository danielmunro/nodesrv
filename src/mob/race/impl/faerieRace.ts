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
  return new RaceBuilder(RaceType.Faerie)
    .setSize(Size.XS)
    .setAppetite(Appetite.Tiny)
    .setSight(Eyesight.Excellent)
    .setDamageAbsorption([
      createDamageModifier(DamageType.Magic, Vulnerability.StrongResist),
      createDamageModifier(DamageType.Bash, Vulnerability.VeryVulnerable)])
    .setPreferredSpecializations([
      SpecializationType.Mage,
      SpecializationType.Cleric,
    ])
    .setAttributes(
      new AttributeBuilder()
        .setStats(-2, 2, 2, 1, -2, -1)
        .setHitRoll(1, 1)
        .build())
    .setStartingSkills([
      SkillType.Meditation,
      SkillType.Infravision,
    ])
    .setCreationPoints(6)
    .setFormattedName(" fae ")
    .create()
}
