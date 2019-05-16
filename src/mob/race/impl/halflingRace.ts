import AttributeBuilder from "../../../attributes/attributeBuilder"
import {newStats} from "../../../attributes/factory"
import {SkillType} from "../../../skill/skillType"
import {SpecializationType} from "../../specialization/enum/specializationType"
import {Appetite} from "../enum/appetite"
import {Eyesight} from "../enum/eyesight"
import {RaceType} from "../enum/raceType"
import {Size} from "../enum/size"
import Race from "../race"
import RaceBuilder from "../raceBuilder"

export default function(): Race {
  return new RaceBuilder(RaceType.Halfling)
    .setSize(Size.M)
    .setAppetite(Appetite.Medium)
    .setSight(Eyesight.AboveAverage)
    .setAttributes(
      new AttributeBuilder()
        .setStats(newStats(-1, 1, 0, 1, 0, 0))
        .build())
    .setPreferredSpecializations([ SpecializationType.Ranger ])
    .setStartingSkills([
      SkillType.Dodge,
      SkillType.Sneak,
    ])
    .create()
}
