import AttributeBuilder from "../../../attributes/attributeBuilder"
import {newStats} from "../../../attributes/factory"
import {SkillType} from "../../../skill/skillType"
import {Vulnerability} from "../../enum/vulnerability"
import {createDamageModifier} from "../../fight/damageModifier"
import {DamageType} from "../../fight/enum/damageType"
import {SpecializationType} from "../../specialization/enum/specializationType"
import {Appetite} from "../enum/appetite"
import {BodyPart, standardPackage} from "../enum/bodyParts"
import {Eyesight} from "../enum/eyesight"
import {RaceType} from "../enum/raceType"
import {Size} from "../enum/size"
import Race from "../race"
import RaceBuilder from "../raceBuilder"

export default function(): Race {
  return new RaceBuilder(RaceType.HalfOrc)
    .setSize(Size.L)
    .setAppetite(Appetite.Large)
    .setSight(Eyesight.Poor)
    .setBodyParts([...standardPackage, BodyPart.Fangs, BodyPart.Horns])
    .setDamageAbsorption([
      createDamageModifier(DamageType.Poison, Vulnerability.Resist),
      createDamageModifier(DamageType.Fire, Vulnerability.Vulnerable)])
    .setPreferredSpecializations([
      SpecializationType.Warrior,
      SpecializationType.Ranger,
    ])
    .setAttributes(
      new AttributeBuilder()
        .setStats(newStats(2, -1, -1, -1, 2, 0))
        .build())
    .setStartingSkills([
      SkillType.Bite,
    ])
    .create()
}
