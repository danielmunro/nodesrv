import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import MobService from "../../../../mob/service/mobService"
import {RequestType} from "../../../../request/requestType"
import {SkillType} from "../../../../skill/skillType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let mobService: MobService
let attacker: MobBuilder
let defender: MobBuilder

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  mobService = app.get<MobService>(Types.MobService)
  attacker = testRunner.createMob()
    .withSkill(SkillType.EyeGouge, MAX_PRACTICE_LEVEL)
    .setLevel(30)
  defender = testRunner.createMob()
})

describe("eye gouge skill action", () => {
  it("imparts blind affect", async () => {
    await testRunner.invokeAction(
        RequestType.EyeGouge,
        `eye ${defender.getMobName()}`,
        defender.mob)

    expect(defender.hasAffect(AffectType.Blind)).toBeTruthy()
  })

  it("causes a fight", async () => {
    await testRunner.invokeAction(
        RequestType.EyeGouge,
        `eye ${defender.getMobName()}`,
        defender.mob)

    expect(mobService.findFightForMob(defender.mob)).toBeDefined()
  })

  it("generates accurate success messages", async () => {
    const response = await testRunner.invokeActionSuccessfully(
        RequestType.EyeGouge,
        `eye ${defender.getMobName()}`,
        defender.mob)

    expect(response.getMessageToRequestCreator())
      .toBe(`you swipe your claws across ${defender.getMobName()}'s face, gouging their eyes!`)
    expect(response.getMessageToTarget())
      .toBe(`${attacker.getMobName()} swipes their claws across your face, gouging your eyes!`)
    expect(response.getMessageToObservers())
      .toBe(`${attacker.getMobName()} swipes their claws across ${defender.getMobName()}'s face, gouging their eyes!`)
  })

  it("generates accurate failure messages", async () => {
    const response = await testRunner.invokeActionFailure(
      RequestType.EyeGouge,
      `eye ${defender.getMobName()}`,
      defender.mob,
      () => defender.removeAffectType(AffectType.Blind))

    expect(response.getMessageToRequestCreator())
      .toBe(`you swipe at ${defender.getMobName()} but miss.`)
    expect(response.getMessageToTarget())
      .toBe(`${attacker.getMobName()} swipes at you but misses.`)
    expect(response.getMessageToObservers())
      .toBe(`${attacker.getMobName()} swipes at ${defender.getMobName()} but misses.`)
  })
})
