import {SpellType} from "../../../spell/spellType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationService from "../service/specializationService"
import SpecializationGroup from "../specializationGroup"
import SpecializationGroupDefinition from "../specializationGroupDefinition"
import {GroupName} from "./enum/groupName"

export default class ProtectionSpecializationGroup implements SpecializationGroupDefinition {
  public create(
    specializationType: SpecializationType,
    specializationService: SpecializationService,
    creationPoints: number): SpecializationGroup {
    const service = specializationService.filterSpecializationType(specializationType)
    return new SpecializationGroup(
      GroupName.Protection,
      specializationType,
      [
        service.getSpecializationLevel(SpellType.ProtectionEvil),
        service.getSpecializationLevel(SpellType.ProtectionGood),
        service.getSpecializationLevel(SpellType.ProtectionNeutral),
        service.getSpecializationLevel(SpellType.Cancellation),
        service.getSpecializationLevel(SpellType.Sanctuary),
        service.getSpecializationLevel(SpellType.Shield),
        service.getSpecializationLevel(SpellType.Armor),
        service.getSpecializationLevel(SpellType.StoneSkin),
      ],
      creationPoints)
  }
}
