import {SpecializationType} from "../mob/specialization/specializationType"

export default class SpellLevel {
  public static create(
    clericLevel: number, mageLevel: number, rangerLevel: number, warriorLevel: number): SpellLevel[] {
    return [
      new SpellLevel(SpecializationType.Cleric, clericLevel),
      new SpellLevel(SpecializationType.Mage, mageLevel),
      new SpellLevel(SpecializationType.Ranger, rangerLevel),
      new SpellLevel(SpecializationType.Warrior, warriorLevel),
    ]
  }

  constructor(
    public readonly specialization: SpecializationType,
    public readonly minimumLevel: number,
  ) {}
}
