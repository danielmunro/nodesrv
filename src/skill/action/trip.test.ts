import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import {RequestType} from "../../request/requestType"
import doNTimes from "../../support/functional/times"
import TestBuilder from "../../test/testBuilder"
import {Messages} from "../precondition/constants"
import SkillDefinition from "../skillDefinition"
import {SkillType} from "../skillType"

let testBuilder: TestBuilder
let skillDefinition: SkillDefinition

beforeEach(async () => {
  testBuilder = new TestBuilder()
  skillDefinition = await testBuilder.getSkillDefinition(SkillType.Trip)
})

describe("trip skill action", () => {
  it("should be able to fail tripping", async () => {
    // setup
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 40)

    // given
    playerBuilder.withSkill(SkillType.Trip)

    // and
    await testBuilder.fight()

    // when
    const responses = await doNTimes(100,
      () => skillDefinition.doAction(testBuilder.createRequest(RequestType.Trip)))

    // then
    expect(responses.some(result => !result.isSuccessful())).toBeTruthy()
  })

  it("should be able to succeed tripping", async () => {
    // setup
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 40)

    // given
    playerBuilder.withSkill(SkillType.Trip, MAX_PRACTICE_LEVEL)

    // and
    await testBuilder.fight()

    // when
    const results = await doNTimes(10,
      () => skillDefinition.doAction(testBuilder.createRequest(RequestType.Trip)))

    // then
    expect(results.some(result => result.isSuccessful())).toBeTruthy()
  })

  it("should not work if the mob is out of movement", async () => {
    // setup
    const playerBuilder = await testBuilder.withPlayer(p => {
      p.sessionMob.vitals.mv = 0
      p.sessionMob.level = 10
    })
    await testBuilder.fight()

    // given
    playerBuilder.withSkill(SkillType.Trip)

    // when
    const response = await skillDefinition.doAction(testBuilder.createRequest(RequestType.Trip))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.All.NotEnoughMv)
  })

  it("success sanity createDefaultCheckFor", async () => {
    // setup
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 10)
    await testBuilder.fight()

    // given
    playerBuilder.withSkill(SkillType.Trip)

    // when
    const response = await skillDefinition.doAction(testBuilder.createRequest(RequestType.Trip))

    // then
    expect(response.isError()).toBeFalsy()
  })
})
