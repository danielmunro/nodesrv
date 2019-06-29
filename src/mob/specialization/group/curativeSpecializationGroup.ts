import {SpellType} from "../../spell/spellType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationService from "../service/specializationService"
import SpecializationGroup from "../specializationGroup"
import SpecializationGroupDefinition from "../specializationGroupDefinition"
import {GroupName} from "./enum/groupName"

export default class CurativeSpecializationGroup implements SpecializationGroupDefinition {
  public create(
    specializationType: SpecializationType,
    specializationService: SpecializationService,
    creationPoints: number): SpecializationGroup {
    const service = specializationService.filterSpecializationType(specializationType)
    return new SpecializationGroup(
      GroupName.Curative,
      specializationType,
      [
        service.getSpecializationLevel(SpellType.CurePoison),
        service.getSpecializationLevel(SpellType.RemoveCurse),
      ],
      creationPoints)
  }
}
