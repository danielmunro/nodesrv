import {SpellType} from "../../spell/spellType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationService from "../service/specializationService"
import SpecializationGroup from "../specializationGroup"
import SpecializationGroupDefinition from "../specializationGroupDefinition"
import {GroupName} from "./enum/groupName"

export default class DetectionSpecializationGroup implements SpecializationGroupDefinition {
  public create(
    specializationType: SpecializationType,
    specializationService: SpecializationService,
    creationPoints: number): SpecializationGroup {
    const service = specializationService.filterSpecializationType(specializationType)
    return new SpecializationGroup(
      GroupName.Detection,
      specializationType,
      [
        service.getSpecializationLevel(SpellType.KnowAlignment),
        service.getSpecializationLevel(SpellType.LocateItem),
        service.getSpecializationLevel(SpellType.DetectHidden),
        service.getSpecializationLevel(SpellType.DetectInvisible),
      ],
      creationPoints)
  }
}
