import AttributeBuilder from "../../../attributes/builder/attributeBuilder"
import {Vulnerability} from "../../enum/vulnerability"
import {createDamageModifier} from "../../fight/damageModifier"
import {DamageType} from "../../fight/enum/damageType"
import {SkillType} from "../../skill/skillType"
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
        .setStats(2, -1, -1, -1, 2, 0)
        .setHitRoll(1, 2)
        .build())
    .setStartingSkills([
      SkillType.Bite,
    ])
    .setCreationPoints(4)
    .setFormattedName("h-orc")
    .create()
}
