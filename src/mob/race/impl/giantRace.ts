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
  return new RaceBuilder(RaceType.Giant)
    .setSize(Size.XL)
    .setAppetite(Appetite.Massive)
    .setSight(Eyesight.VeryPoor)
    .setDamageAbsorption([
      new DamageModifier(DamageType.Magic, Vulnerability.VeryVulnerable),
      new DamageModifier(DamageType.Mental, Vulnerability.Vulnerable),
      new DamageModifier(DamageType.Frost, Vulnerability.Resist),
      new DamageModifier(DamageType.Fire, Vulnerability.Resist),
      new DamageModifier(DamageType.Bash, Vulnerability.Resist),
      new DamageModifier(DamageType.Slash, Vulnerability.Resist),
      new DamageModifier(DamageType.Pierce, Vulnerability.Resist)])
    .setPreferredSpecializations([
      SpecializationType.Warrior,
    ])
    .setAttributes(
      new AttributeBuilder()
        .setStats(newStats(2, -2, -2, -1, 2, 1))
        .build())
    .setStartingSkills([
      SkillType.EnhancedDamage,
      SkillType.Shout,
    ])
    .create()
}