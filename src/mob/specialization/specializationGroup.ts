import Customization from "./customization"
import {SpecializationType} from "./enum/specializationType"
import {GroupName} from "./group/enum/groupName"
import SpecializationLevel from "./specializationLevel"

export default class SpecializationGroup implements Customization {
  constructor(
    public readonly groupName: GroupName,
    public readonly specializationType: SpecializationType,
    public readonly specializationLevels: SpecializationLevel[],
    public readonly creationPoints: number) {}

  public getName(): string {
    return this.groupName
  }

  public getCreationPoints(): number {
    return this.creationPoints
  }
}
