import {createTestAppContainer} from "../../../app/testFactory"
import {Types} from "../../../support/types"
import {SpecializationType} from "../enum/specializationType"
import SpecializationService from "../service/specializationService"
import SpecializationGroup from "../specializationGroup"
import specializationGroups from "../specializationGroups"
import {GroupName} from "./enum/groupName"

let specializationService: SpecializationService
let specializationGroup: SpecializationGroup

beforeEach(async () => {
  specializationService = (await createTestAppContainer())
    .get<SpecializationService>(Types.SpecializationService)
})

describe("benediction specialization group", () => {
  it("includes the right number of spells for a cleric", () => {
    // when
    specializationGroup = specializationGroups(specializationService).find(specialization =>
      specialization.groupName === GroupName.Benedictions
      && specialization.specializationType === SpecializationType.Cleric) as SpecializationGroup

    // expect
    expect(specializationGroup.specializationLevels).toHaveLength(3)
  })

  it("does not exist for a mage", () => {
    // when
    specializationGroup = specializationGroups(specializationService).find(specialization =>
      specialization.groupName === GroupName.Benedictions
      && specialization.specializationType === SpecializationType.Mage) as SpecializationGroup

    // then
    expect(specializationGroup).toBeUndefined()
  })
})
