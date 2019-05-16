import Attributes from "../../attributes/model/attributes"
import {SkillType} from "../../skill/skillType"
import DamageModifier from "../damageModifier"
import {SpecializationType} from "../specialization/enum/specializationType"
import {Appetite} from "./enum/appetite"
import {BodyPart, standardPackage} from "./enum/bodyParts"
import {Eyesight} from "./enum/eyesight"
import {RaceType} from "./enum/raceType"
import {Size} from "./enum/size"
import Race from "./race"

export default class RaceBuilder {
  private size: Size = Size.M
  private sight: number = 0.5
  private appetite: number = 4
  private bodyParts: BodyPart[] = standardPackage
  private damageAbsorption: DamageModifier[] = []
  private attributes: Attributes
  private preferredSpecializations: SpecializationType[] = []
  private startingSkills: SkillType[] = []
  private creationPoints: number = 0

  constructor(private raceType: RaceType) {}

  public setSize(size: Size): RaceBuilder {
    this.size = size
    return this
  }

  public setSight(sight: Eyesight): RaceBuilder {
    this.sight = sight
    return this
  }

  public setAppetite(appetite: Appetite): RaceBuilder {
    this.appetite = appetite
    return this
  }

  public setBodyParts(bodyParts: BodyPart[]): RaceBuilder {
    this.bodyParts = bodyParts
    return this
  }

  public setDamageAbsorption(damageModifiers: DamageModifier[]): RaceBuilder {
    this.damageAbsorption = damageModifiers
    return this
  }

  public setPreferredSpecializations(specializations: SpecializationType[]): RaceBuilder {
    this.preferredSpecializations = specializations
    return this
  }

  public setAttributes(attributes: Attributes): RaceBuilder {
    this.attributes = attributes
    return this
  }

  public setStartingSkills(skills: SkillType[]): RaceBuilder {
    this.startingSkills = skills
    return this
  }

  public setCreationPoints(points: number): RaceBuilder {
    this.creationPoints = points
    return this
  }

  public create(): Race {
    return new Race(
      this.raceType,
      this.size,
      this.sight,
      this.appetite,
      this.bodyParts,
      this.damageAbsorption,
      this.attributes,
      this.preferredSpecializations,
      this.startingSkills,
      this.creationPoints)
  }
}
