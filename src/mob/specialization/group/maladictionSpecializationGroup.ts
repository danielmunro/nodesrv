import {SpellType} from "../../spell/spellType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationService from "../service/specializationService"
import SpecializationGroup from "../specializationGroup"
import SpecializationGroupDefinition from "../specializationGroupDefinition"
import {GroupName} from "./enum/groupName"

export default class MaladictionSpecializationGroup implements SpecializationGroupDefinition {
  public create(
    specializationType: SpecializationType,
    specializationService: SpecializationService,
    creationPoints: number): SpecializationGroup {
    return new SpecializationGroup(
      GroupName.Maladictions,
      specializationType,
      [
        specializationService.getSpecializationLevel(SpellType.Blind),
        specializationService.getSpecializationLevel(SpellType.Slow),
        specializationService.getSpecializationLevel(SpellType.Poison),
        specializationService.getSpecializationLevel(SpellType.Curse),
        specializationService.getSpecializationLevel(SpellType.Slow),
      ],
      creationPoints)
  }
}
