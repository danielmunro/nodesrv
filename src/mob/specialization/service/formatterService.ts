import SpecializationGroup from "../specializationGroup"
import SpecializationLevel from "../specializationLevel"

const columnWidth = 18

export default class FormatterService {
  private static column(text: string): string {
    while (text.length < columnWidth) {
      text += " "
    }
    return text
  }

  constructor(
    private readonly specializationGroups: SpecializationGroup[],
    private readonly specializationLevels: SpecializationLevel[]) {}

  public format(): string {
    return FormatterService.column("group") + FormatterService.column("creation points") + "\n"
      + this.specializationGroups.reduce((previous: string, current: SpecializationGroup, i: number) =>
      previous + FormatterService.column(current.groupName)
        + FormatterService.column(current.creationPoints.toString())
        + (i % 2 === 1 ? "\n" : ""), "") + "\n"
      + FormatterService.column("skill") + FormatterService.column("creation points") + "\n"
      + this.specializationLevels.reduce((previous: string, current: SpecializationLevel, i) =>
      previous + FormatterService.column(current.abilityType)
        + FormatterService.column(current.creationPoints.toString())
        + (i % 2 === 1 ? "\n" : ""), "") + "\n"
  }
}
