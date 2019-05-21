import AttributeBuilder from "../../../attributes/builder/attributeBuilder"
import {newStats} from "../../../attributes/factory/attributeFactory"
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
  return new RaceBuilder(RaceType.Kender)
    .setSize(Size.M)
    .setAppetite(Appetite.Small)
    .setSight(Eyesight.Good)
    .setDamageAbsorption([
      createDamageModifier(DamageType.Mental, Vulnerability.Vulnerable),
      createDamageModifier(DamageType.Magic, Vulnerability.Vulnerable)])
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
    .setCreationPoints(4)
    .create()
}
