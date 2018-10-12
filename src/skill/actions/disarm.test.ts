import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import MobBuilder from "../../test/mobBuilder"
import TestBuilder from "../../test/testBuilder"
import { getSkillActionDefinition } from "../skillTable"
import { SkillType } from "../skillType"

const iterations = 100
const definition = getSkillActionDefinition(SkillType.Disarm)
let testBuilder: TestBuilder
let mob1: MobBuilder
let mob2: MobBuilder

beforeEach(() => {
  testBuilder = new TestBuilder()
  mob1 = testBuilder.withMob()
  mob1.mob.level = 50
  mob2 = testBuilder.withMob()
  mob2.mob.level = 50
})

describe("disarm skill action", () => {
  it("should disarm the equipped weapon onto the ground only once", async () => {
    // given
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)

    // and
    mob2.equip().withMaceEq()

    // and
    testBuilder.fight(mob2.mob)

    // when
    const responses = await doNTimes(iterations, () =>
      definition.doAction(testBuilder.createRequest(RequestType.Disarm)))

    // then
    expect(responses.filter(r => r.isSuccessful())).toHaveLength(1)
    expect(testBuilder.room.inventory.items).toHaveLength(1)
    expect(mob2.mob.equipped.inventory.items).toHaveLength(0)
  })

  it("should succeed a reasonable number of times when practiced", async () => {
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL * 0.75)

    testBuilder.fight(mob2.mob)

    const responses = await doNTimes(iterations, () => {
      mob2.equip().withMaceEq()
      return definition.doAction(testBuilder.createRequest(RequestType.Disarm))
    })

    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThan(iterations * 0.4)
  })
})
