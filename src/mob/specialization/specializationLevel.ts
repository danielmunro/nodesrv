import {SpecializationType} from "./specializationType"

export default class SpecializationLevel {
  public static create(
    clericLevel: number, mageLevel: number, rangerLevel: number, warriorLevel: number): SpecializationLevel[] {
    return [
      new SpecializationLevel(SpecializationType.Cleric, clericLevel),
      new SpecializationLevel(SpecializationType.Mage, mageLevel),
      new SpecializationLevel(SpecializationType.Ranger, rangerLevel),
      new SpecializationLevel(SpecializationType.Warrior, warriorLevel),
    ]
  }

  constructor(
    public readonly specialization: SpecializationType,
    public readonly minimumLevel: number,
  ) {}
}
