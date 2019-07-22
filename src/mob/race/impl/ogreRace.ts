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
  return new RaceBuilder(RaceType.Ogre)
    .setSize(Size.L)
    .setAppetite(Appetite.Massive)
    .setSight(Eyesight.VeryPoor)
    .setBodyParts([...standardPackage, BodyPart.Fangs])
    .setDamageAbsorption([
      createDamageModifier(DamageType.Mental, Vulnerability.Vulnerable),
      createDamageModifier(DamageType.Magic, Vulnerability.Vulnerable),
      createDamageModifier(DamageType.Bash, Vulnerability.Resist),
      createDamageModifier(DamageType.Slash, Vulnerability.Resist),
      createDamageModifier(DamageType.Pierce, Vulnerability.Resist)])
    .setPreferredSpecializations([
      SpecializationType.Warrior,
    ])
    .setAttributes(
      new AttributeBuilder()
        .setStats(2, -2, 0, -1, 2, 0)
        .setHitRoll(1, 2)
        .build())
    .setStartingSkills([
      SkillType.Axe,
      SkillType.Bite,
    ])
    .setCreationPoints(6)
    .setFormattedName("ogre ")
    .create()
}
