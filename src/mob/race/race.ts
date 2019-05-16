import Attributes from "../../attributes/model/attributes"
import {SkillType} from "../../skill/skillType"
import DamageModifier from "../fight/damageModifier"
import {SpecializationType} from "../specialization/enum/specializationType"
import {Appetite} from "./enum/appetite"
import {BodyPart} from "./enum/bodyParts"
import {Eyesight} from "./enum/eyesight"
import {RaceType} from "./enum/raceType"
import {Size} from "./enum/size"

export default class Race {
  constructor(
    public readonly raceType: RaceType,
    public readonly size: Size,
    public readonly sight: Eyesight,
    public readonly appetite: Appetite,
    public readonly bodyParts: BodyPart[],
    public readonly damageAbsorption: DamageModifier[],
    public readonly attributes: Attributes,
    public readonly preferredSpecializations: SpecializationType[],
    public readonly startingSkills: SkillType[],
    public readonly creationPoints: number) {}
}
