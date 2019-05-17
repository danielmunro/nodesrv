import AttributeBuilder from "../../../attributes/attributeBuilder"
import {newStats} from "../../../attributes/factory"
import {SkillType} from "../../../skill/skillType"
import {Vulnerability} from "../../enum/vulnerability"
import DamageModifier from "../../fight/damageModifier"
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
  return new RaceBuilder(RaceType.Ogre)
    .setSize(Size.L)
    .setAppetite(Appetite.Massive)
    .setSight(Eyesight.VeryPoor)
    .setBodyParts([...standardPackage, BodyPart.Fangs])
    .setDamageAbsorption([
      new DamageModifier(DamageType.Mental, Vulnerability.Vulnerable),
      new DamageModifier(DamageType.Magic, Vulnerability.Vulnerable),
      new DamageModifier(DamageType.Bash, Vulnerability.Resist),
      new DamageModifier(DamageType.Slash, Vulnerability.Resist),
      new DamageModifier(DamageType.Pierce, Vulnerability.Resist)])
    .setPreferredSpecializations([
      SpecializationType.Warrior,
    ])
    .setAttributes(
      new AttributeBuilder()
        .setStats(newStats(2, -2, 0, -1, 2, 0))
        .build())
    .setStartingSkills([
      SkillType.Axe,
      SkillType.Bite,
    ])
    .create()
}
