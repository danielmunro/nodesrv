import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/enum/requestType"
import {SkillType} from "../../../../skill/skillType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("shield bash skill action", () => {
  it("doesn't work without the skill", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.ShieldBash)

    // then
    expect(response.getMessageToRequestCreator()).toBe("You lack the skill.")
  })

  it("bounces off an orb of touch", async () => {
    // given
    const attacker = testRunner.createMob()
      .withSkill(SkillType.ShieldBash, MAX_PRACTICE_LEVEL)
      .setLevel(30)
    const target = testRunner.createMob().addAffectType(AffectType.OrbOfTouch)

    // when
    const response = await testRunner.invokeAction(
      RequestType.ShieldBash,
      `shield ${target.getMobName()}`,
      target.mob)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you bounce off of ${target.getMobName()}'s orb of touch.`)
    expect(response.getMessageToTarget())
      .toBe(`${attacker.getMobName()} bounces off of your orb of touch.`)
    expect(response.getMessageToObservers())
      .toBe(`${attacker.getMobName()} bounces off of ${target.getMobName()}'s orb of touch.`)
  })

  it("generates accurate success messages", async () => {
    const attacker = testRunner.createMob()
      .withSkill(SkillType.ShieldBash, MAX_PRACTICE_LEVEL)
      .setLevel(30)
    const target = testRunner.createMob()

    const response = await testRunner.invokeActionSuccessfully(
      RequestType.ShieldBash, `shield '${target.getMobName()}'`, target.get())

    expect(response.getMessageToRequestCreator())
      .toBe(`you smack ${target.getMobName()} in the face with your shield.`)
    expect(response.getMessageToTarget())
      .toBe(`${attacker.getMobName()} smacks you in the face with their shield.`)
    expect(response.getMessageToObservers())
      .toBe(`${attacker.getMobName()} smacks ${target.getMobName()} in the face with their shield.`)
  })

  it("generates accurate fail messages", async () => {
    const attacker = testRunner.createMob()
      .withSkill(SkillType.ShieldBash)
      .setLevel(30)
    const target = testRunner.createMob()

    const response = await testRunner.invokeActionFailure(
      RequestType.ShieldBash, `shield '${target.getMobName()}'`, target.get())

    expect(response.getMessageToRequestCreator())
      .toBe(`you attempt to shield bash ${target.getMobName()} but fail.`)
    expect(response.getMessageToTarget())
      .toBe(`${attacker.getMobName()} attempts to shield bash you but fails.`)
    expect(response.getMessageToObservers())
      .toBe(`${attacker.getMobName()} attempts to shield bash ${target.getMobName()} but fails.`)
  })
})
