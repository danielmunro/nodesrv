import {AffectType} from "../../../../affect/affectType"
import {createTestAppContainer} from "../../../../app/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SkillType} from "../../../../skill/skillType"
import PlayerBuilder from "../../../../support/test/playerBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let player: PlayerBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  player = testRunner.createPlayer()
    .setLevel(20)
})

describe("bash skill action", () => {
  it("can trigger a failed bash", async () => {
    // given
    player.addSkill(SkillType.Bash)
    testRunner.fight()

    // when
    const response = await testRunner.invokeActionFailure(RequestType.Bash)

    // then
    expect(response).toBeDefined()
  })

  it("can trigger a successful bash", async () => {
    // given
    player.setLevel(20).addSkill(SkillType.Bash, MAX_PRACTICE_LEVEL)
    const opponent = testRunner.createMob()
    testRunner.fight(opponent.mob)

    // when
    await testRunner.invokeActionSuccessfully(RequestType.Bash)

    // then
    expect(opponent.hasAffect(AffectType.Stunned)).toBeDefined()
  })

  it("bounces off an orb of touch", async () => {
    // given
    player.addSkill(SkillType.Bash, MAX_PRACTICE_LEVEL)
    const target = testRunner.createMob()
      .addAffectType(AffectType.OrbOfTouch)

    // when
    const response = await testRunner.invokeAction(
      RequestType.Bash,
      `bash ${target.getMobName()}`,
      target.mob)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you bounce off of ${target.getMobName()}'s orb of touch.`)
    expect(response.getMessageToTarget())
      .toBe(`${player.getMobName()} bounces off of your orb of touch.`)
    expect(response.getMessageToObservers())
      .toBe(`${player.getMobName()} bounces off of ${target.getMobName()}'s orb of touch.`)
  })

  it("generates messages correctly", async () => {
    // given
    player.setLevel(20).addSkill(SkillType.Bash, MAX_PRACTICE_LEVEL / 2)
    const opponent = testRunner.createMob()
    testRunner.fight(opponent.mob)

    // when
    const response1 = await testRunner.invokeActionSuccessfully(RequestType.Bash)

    // then
    expect(response1.getMessageToRequestCreator())
      .toBe(`you slam into ${opponent.getMobName()} and send them flying!`)
    expect(response1.getMessageToTarget())
      .toBe(`${player.getMob().name} slams into you and sends you flying!`)
    expect(response1.getMessageToObservers())
      .toBe(`${player.getMob().name} slams into ${opponent.getMobName()} and sends them flying!`)

    // and
    const response2 = await testRunner.invokeActionFailure(RequestType.Bash)
    expect(response2.getMessageToRequestCreator())
      .toBe("you fall flat on your face!")
    expect(response2.getMessageToTarget())
      .toBe(`${player.getMob().name} falls flat on their face!`)
    expect(response2.getMessageToObservers())
      .toBe(`${player.getMob().name} falls flat on their face!`)
  })
})
