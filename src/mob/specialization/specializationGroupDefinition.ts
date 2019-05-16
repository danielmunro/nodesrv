import {SpecializationType} from "./enum/specializationType"
import SpecializationService from "./service/specializationService"
import SpecializationGroup from "./specializationGroup"

export default interface SpecializationGroupDefinition {
  create(
    specializationType: SpecializationType,
    specializationService: SpecializationService,
    creationPoints: number): SpecializationGroup
}
