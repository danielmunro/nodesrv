import {AffectType} from "../../../../affect/enum/affectType"
import {newAffect} from "../../../../affect/factory/affectFactory"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {MobEntity} from "../../../../mob/entity/mobEntity"
import {RequestType} from "../../../../request/enum/requestType"
import {SkillType} from "../../../../skill/skillType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import {ConditionMessages} from "../../../constants"

let testRunner: TestRunner
let mob: MobEntity
let target: MobEntity

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mob = testRunner.createMob()
    .withSkill(SkillType.DetectHidden, MAX_PRACTICE_LEVEL)
    .setLevel(30)
    .get()
  target = testRunner.createMob().addAffectType(AffectType.Hidden).get()
})

describe("detect hidden action", () => {
  it("allows a mob to see hidden mobs", async () => {
    // given
    mob.affect().add(newAffect(AffectType.DetectHidden))

    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Look, `look ${target}`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`a test fixture

Equipped:
`)
  })

  it("sanity -- cannot see without detect hidden", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Look, `look ${target}`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Item.NotFound)
  })

  it("generates accurate success messages", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.DetectHidden)

    // then
    expect(response.getMessageToRequestCreator()).toBe("your eyes tingle.")
    expect(response.getMessageToTarget()).toBe("your eyes tingle.")
    expect(response.getMessageToObservers()).toBe(`${mob}'s eyes tingle.`)
  })

  it("generates accurate failure messages", async () => {
    // when
    const response = await testRunner.invokeActionFailure(RequestType.DetectHidden)

    // then
    expect(response.getMessageToRequestCreator()).toBe("You lost your concentration.")
  })
})
