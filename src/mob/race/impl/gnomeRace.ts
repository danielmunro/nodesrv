import AttributeBuilder from "../../../attributes/builder/attributeBuilder"
import {SkillType} from "../../skill/skillType"
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
  return new RaceBuilder(RaceType.Gnome)
    .setSize(Size.S)
    .setAppetite(Appetite.Small)
    .setSight(Eyesight.SlightlyPoor)
    .setDamageAbsorption([
      createDamageModifier(DamageType.Magic, Vulnerability.Resist),
      createDamageModifier(DamageType.Bash, Vulnerability.Vulnerable)])
    .setPreferredSpecializations([
      SpecializationType.Mage,
    ])
    .setAttributes(
      new AttributeBuilder()
        .setStats(-2, 1, 2, 0, -1, 0)
        .build())
    .setStartingSkills([
      SkillType.Sneak,
      SkillType.Lore,
    ])
    .setCreationPoints(7)
    .create()
}
