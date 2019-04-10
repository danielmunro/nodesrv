import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SkillType} from "../../../../skill/skillType"
import {getFailureAction, getSuccessfulAction} from "../../../../support/functional/times"
import PlayerBuilder from "../../../../support/test/playerBuilder"
import TestBuilder from "../../../../support/test/testBuilder"

let testBuilder: TestBuilder
let player: PlayerBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  player = await testBuilder.withPlayer()
})

describe("shield bash skill action", () => {
  it("doesn't work without the skill", async () => {
    // when
    const response = await testBuilder.handleAction(RequestType.ShieldBash)

    // then
    expect(response.getMessageToRequestCreator()).toBe("You lack the skill.")
  })

  it("bounces off an orb of touch", async () => {
    // given
    player.addSkill(SkillType.ShieldBash, MAX_PRACTICE_LEVEL).setLevel(30)
    const target = testBuilder.withMob().addAffectType(AffectType.OrbOfTouch)

    // when
    const response = await testBuilder.handleAction(
      RequestType.ShieldBash,
      `shield ${target.getMobName()}`,
      target.mob)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you bounce off of ${target.getMobName()}'s orb of touch.`)
    expect(response.message.getMessageToTarget())
      .toBe(`${player.getMobName()} bounces off of your orb of touch.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${player.getMobName()} bounces off of ${target.getMobName()}'s orb of touch.`)
  })

  it("generates accurate success messages", async () => {
    player.addSkill(SkillType.ShieldBash, MAX_PRACTICE_LEVEL).setLevel(30)
    const target = testBuilder.withMob()

    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.ShieldBash),
      testBuilder.createRequest(
        RequestType.ShieldBash,
        `shield '${target.getMobName()}'`,
        target.mob))

    expect(response.getMessageToRequestCreator())
      .toBe(`you smack ${target.getMobName()} in the face with your shield.`)
    expect(response.message.getMessageToTarget())
      .toBe(`${player.getMob().name} smacks you in the face with their shield.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${player.getMob().name} smacks ${target.getMobName()} in the face with their shield.`)
  })

  it("generates accurate fail messages", async () => {
    player.addSkill(SkillType.ShieldBash).setLevel(30)
    const target = testBuilder.withMob()

    const response = await getFailureAction(
      await testBuilder.getAction(RequestType.ShieldBash),
      testBuilder.createRequest(
        RequestType.ShieldBash,
        `shield '${target.getMobName()}'`,
        target.mob))

    expect(response.getMessageToRequestCreator())
      .toBe(`you attempt to shield bash ${target.getMobName()} but fail.`)
    expect(response.message.getMessageToTarget())
      .toBe(`${player.getMob().name} attempts to shield bash you but fails.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${player.getMob().name} attempts to shield bash ${target.getMobName()} but fails.`)
  })
})
