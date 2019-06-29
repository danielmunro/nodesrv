import {SpellType} from "../../spell/spellType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationService from "../service/specializationService"
import SpecializationGroup from "../specializationGroup"
import SpecializationGroupDefinition from "../specializationGroupDefinition"
import {GroupName} from "./enum/groupName"

export default class PietySpecializationGroup implements SpecializationGroupDefinition {
  public create(
    specializationType: SpecializationType,
    specializationService: SpecializationService,
    creationPoints: number): SpecializationGroup {
    const service = specializationService.filterSpecializationType(specializationType)
    return new SpecializationGroup(
      GroupName.Piety,
      specializationType,
      [
        service.getSpecializationLevel(SpellType.HolySilence),
        service.getSpecializationLevel(SpellType.Crusade),
        service.getSpecializationLevel(SpellType.Bless),
        service.getSpecializationLevel(SpellType.Curse),
        service.getSpecializationLevel(SpellType.Wrath),
      ],
      creationPoints)
  }
}
