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
  return new RaceBuilder(RaceType.Kender)
    .setSize(Size.M)
    .setAppetite(Appetite.Small)
    .setSight(Eyesight.Good)
    .setDamageAbsorption([
      new DamageModifier(DamageType.Mental, Vulnerability.Vulnerable),
      new DamageModifier(DamageType.Magic, Vulnerability.Vulnerable)])
    .setPreferredSpecializations([
      SpecializationType.Ranger,
      SpecializationType.Warrior,
    ])
    .setAttributes(
      new AttributeBuilder()
        .setStats(newStats(1, 1, 0, 1, -1, -1))
        .build())
    .setStartingSkills([
      SkillType.Dagger,
      SkillType.Sneak,
    ])
    .create()
}
