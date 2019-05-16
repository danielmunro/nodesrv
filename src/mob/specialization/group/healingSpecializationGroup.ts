import {SpellType} from "../../../spell/spellType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationService from "../service/specializationService"
import SpecializationGroup from "../specializationGroup"
import SpecializationGroupDefinition from "../specializationGroupDefinition"
import {GroupName} from "./enum/groupName"

export default class HealingSpecializationGroup implements SpecializationGroupDefinition {
  public create(
    specializationType: SpecializationType,
    specializationService: SpecializationService,
    creationPoints: number): SpecializationGroup {
    const service = specializationService.filterSpecializationType(specializationType)
    return new SpecializationGroup(
      GroupName.Healing,
      specializationType,
      [
        service.getSpecializationLevel(SpellType.CureLight),
        service.getSpecializationLevel(SpellType.CureSerious),
        service.getSpecializationLevel(SpellType.Heal),
        service.getSpecializationLevel(SpellType.RefreshMovement),
      ],
      creationPoints)
  }
}
