import AttributeBuilder from "../../../attributes/builder/attributeBuilder"
import {SkillType} from "../../../skill/skillType"
import {Vulnerability} from "../../enum/vulnerability"
import {createDamageModifier} from "../../fight/damageModifier"
import {DamageType} from "../../fight/enum/damageType"
import {SpecializationType} from "../../specialization/enum/specializationType"
import {Appetite} from "../enum/appetite"
import {Eyesight} from "../enum/eyesight"
import {RaceType} from "../enum/raceType"
import {Size} from "../enum/size"
import Race from "../race"
import RaceBuilder from "../raceBuilder"

export default function(): Race {
  return new RaceBuilder(RaceType.Giant)
    .setSize(Size.XL)
    .setAppetite(Appetite.Massive)
    .setSight(Eyesight.VeryPoor)
    .setDamageAbsorption([
      createDamageModifier(DamageType.Magic, Vulnerability.VeryVulnerable),
      createDamageModifier(DamageType.Mental, Vulnerability.Vulnerable),
      createDamageModifier(DamageType.Frost, Vulnerability.Resist),
      createDamageModifier(DamageType.Fire, Vulnerability.Resist),
      createDamageModifier(DamageType.Bash, Vulnerability.Resist),
      createDamageModifier(DamageType.Slash, Vulnerability.Resist),
      createDamageModifier(DamageType.Pierce, Vulnerability.Resist)])
    .setPreferredSpecializations([
      SpecializationType.Warrior,
    ])
    .setAttributes(
      new AttributeBuilder()
        .setStats(2, -2, -2, -1, 2, 1)
        .build())
    .setStartingSkills([
      SkillType.EnhancedDamage,
      SkillType.Shout,
    ])
    .setCreationPoints(6)
    .create()
}
