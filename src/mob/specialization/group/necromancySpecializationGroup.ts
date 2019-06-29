import {SpellType} from "../../spell/spellType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationService from "../service/specializationService"
import SpecializationGroup from "../specializationGroup"
import SpecializationGroupDefinition from "../specializationGroupDefinition"
import {GroupName} from "./enum/groupName"

export default class NecromancySpecializationGroup implements SpecializationGroupDefinition {
  public create(
    specializationType: SpecializationType,
    specializationService: SpecializationService,
    creationPoints: number): SpecializationGroup {
    const service = specializationService.filterSpecializationType(specializationType)
    return new SpecializationGroup(
      GroupName.Necromancy,
      specializationType,
      [
        service.getSpecializationLevel(SpellType.SummonUndead),
        service.getSpecializationLevel(SpellType.TurnUndead),
        service.getSpecializationLevel(SpellType.DrawLife),
        service.getSpecializationLevel(SpellType.WithstandDeath),
      ],
      creationPoints)
  }
}
