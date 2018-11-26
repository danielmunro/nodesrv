import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import doNTimes from "../../support/functional/times"
import MobBuilder from "../../test/mobBuilder"
import TestBuilder from "../../test/testBuilder"
import SkillDefinition from "../skillDefinition"
import { SkillType } from "../skillType"

const iterations = 100
let testBuilder: TestBuilder
let skillDefinition: SkillDefinition
let mob1: MobBuilder
let mob2: MobBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mob1 = testBuilder.withMob()
  mob1.withLevel(50)
  mob2 = testBuilder.withMob()
  mob2.withLevel(50)
  skillDefinition = await testBuilder.getSkillDefinition(SkillType.Disarm)
})

describe("disarm skill action", () => {
  it("should disarm the equipped weapon onto the ground only once", async () => {
    // given
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)

    // and
    mob2.equip().withMaceEq()

    // and
    await testBuilder.fight(mob2.mob)

    // when
    const responses = await doNTimes(iterations, () =>
      skillDefinition.doAction(testBuilder.createRequest(RequestType.Disarm, "disarm", mob2.mob)))

    // then
    expect(responses.filter(r => r.isSuccessful())).toHaveLength(1)
    expect(testBuilder.room.inventory.items).toHaveLength(1)
    expect(mob2.mob.equipped.items).toHaveLength(0)
  })

  it("should succeed a reasonable number of times when practiced", async () => {
    // setup
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL * 0.75)
    await testBuilder.fight(mob2.mob)

    // when
    const responses = await doNTimes(iterations, () => {
      mob2.equip().withMaceEq()
      return skillDefinition.doAction(testBuilder.createRequest(RequestType.Disarm))
    })

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThan(iterations * 0.4)
  })
})
