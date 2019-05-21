import {createTestAppContainer} from "../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import {RequestType} from "../../request/enum/requestType"
import {ConditionMessages as SkillMessages} from "../../skill/constants"
import {SpellType} from "../../spell/spellType"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {ConditionMessages} from "../constants"

const TEST_INPUT_SHIELD = "cast shield"
const TEST_INPUT_CAST = "cast"
const TEST_INPUT_POISON = "cast poison"
const TEST_INPUT_INVALID = "cast floodle"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("cast spell action", () => {
  it("should be able to cast a known spell", async () => {
    // given
    testRunner.createMob()
      .setLevel(20)
      .withSpell(SpellType.Blind, MAX_PRACTICE_LEVEL)

    const target = testRunner.createMob().mob

    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast blind", target)

    // then
    expect(response).toBeDefined()
    expect(target.affect().isBlind()).toBeTruthy()
  })

  it("should require at least one argument", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Cast, TEST_INPUT_CAST)

    // then
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Arguments.Cast)
    expect(response.isError()).toBeTruthy()
  })

  it("should know if an argument has or has not a spell", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Cast, TEST_INPUT_POISON)

    // then
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Cast.SpellNotKnown)
    expect(response.isError()).toBeTruthy()

    // and when
    const response1 = await testRunner.invokeAction(RequestType.Cast, TEST_INPUT_INVALID)

    // then
    expect(response1.getMessageToRequestCreator()).toBe(ConditionMessages.Cast.NotASpell)
    expect(response1.isError()).toBeTruthy()
  })

  it("should display an appropriate result if the caster lacks mana", async () => {
    // given
    testRunner.createMob()
      .withSpell(SpellType.Shield, MAX_PRACTICE_LEVEL)
      .setMana(0)
      .setLevel(30)

    // when
    const response = await testRunner.invokeAction(RequestType.Cast, TEST_INPUT_SHIELD)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(SkillMessages.All.NotEnoughMana)
  })
})
