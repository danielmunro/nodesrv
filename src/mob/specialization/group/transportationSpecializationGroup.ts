import {SpellType} from "../../spell/spellType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationService from "../service/specializationService"
import SpecializationGroup from "../specializationGroup"
import SpecializationGroupDefinition from "../specializationGroupDefinition"
import {GroupName} from "./enum/groupName"

export default class TransportationSpecializationGroup implements SpecializationGroupDefinition {
  public create(
    specializationType: SpecializationType,
    specializationService: SpecializationService,
    creationPoints: number): SpecializationGroup {
    const service = specializationService.filterSpecializationType(specializationType)
    return new SpecializationGroup(
      GroupName.Transportation,
      specializationType,
      [
        service.getSpecializationLevel(SpellType.Fly),
        service.getSpecializationLevel(SpellType.Summon),
        service.getSpecializationLevel(SpellType.WordOfRecall),
      ],
      creationPoints)
  }
}
