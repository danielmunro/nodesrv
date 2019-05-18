import Attributes from "../../attributes/model/attributes"
import {SkillType} from "../../skill/skillType"
import DamageModifier from "../fight/damageModifier"
import {SpecializationType} from "../specialization/enum/specializationType"
import {Appetite} from "./enum/appetite"
import {BodyPart} from "./enum/bodyParts"
import {Eyesight} from "./enum/eyesight"
import {RaceType} from "./enum/raceType"
import {Size} from "./enum/size"

export default interface Race {
  readonly raceType: RaceType,
  readonly size: Size,
  readonly sight: Eyesight,
  readonly appetite: Appetite,
  readonly bodyParts: BodyPart[],
  readonly damageAbsorption: DamageModifier[],
  readonly attributes: Attributes,
  readonly preferredSpecializations: SpecializationType[],
  readonly startingSkills: SkillType[],
  readonly creationPoints: number,
}
