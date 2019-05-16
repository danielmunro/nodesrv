import {SpellType} from "../../../spell/spellType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationService from "../service/specializationService"
import SpecializationGroup from "../specializationGroup"
import SpecializationGroupDefinition from "../specializationGroupDefinition"
import {GroupName} from "./enum/groupName"

export default class BenedictionSpecializationGroup implements SpecializationGroupDefinition {
  public create(
    specializationType: SpecializationType,
    specializationService: SpecializationService,
    creationPoints: number): SpecializationGroup {
    const service = specializationService.filterSpecializationType(specializationType)
    return new SpecializationGroup(
      GroupName.Benedictions,
      specializationType,
      [
        service.getSpecializationLevel(SpellType.Bless),
        service.getSpecializationLevel(SpellType.Feast),
        service.getSpecializationLevel(SpellType.RemoveCurse),
      ],
      creationPoints)
  }
}
