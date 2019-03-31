import {AffectType} from "../../affect/affectType"
import {CheckStatus} from "../../check/checkStatus"
import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import {SpecializationType} from "../../mob/specialization/specializationType"
import {RequestType} from "../../request/requestType"
import {ConditionMessages as SkillMessages} from "../../skill/constants"
import {Spell} from "../../spell/model/spell"
import {SpellType} from "../../spell/spellType"
import {getSuccessfulAction} from "../../support/functional/times"
import TestBuilder from "../../test/testBuilder"
import Action from "../action"
import {ConditionMessages} from "../constants"

const TEST_INPUT_SHIELD = "cast shield"
const TEST_INPUT_CAST = "cast"
const TEST_INPUT_POISON = "cast poison"
const TEST_INPUT_INVALID = "cast floodle"

let testBuilder: TestBuilder
let action: Action

function newSpell(spellType: SpellType) {
  const spell = new Spell()
  spell.spellType = spellType

  return spell
}

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getAction(RequestType.Cast)
})

describe("cast spell action", () => {
  it("should be able to cast a known spell", async () => {
    // given
    testBuilder.withMob()
      .setLevel(20)
      .withSpell(SpellType.Blind, MAX_PRACTICE_LEVEL)

    const target = testBuilder.withMob().mob

    // when
    const response = await getSuccessfulAction(
      action, testBuilder.createRequest(RequestType.Cast, "cast blind", target))

    // then
    await expect(response).toBeDefined()
    expect(target.getAffect(AffectType.Blind)).toBeDefined()
  })

  it("should require at least one argument", async () => {
    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Cast, TEST_INPUT_CAST))

    // then
    expect(check.result).toBe(ConditionMessages.All.Arguments.Cast)
    expect(check.status).toBe(CheckStatus.Failed)
  })

  it("should know if an argument is or is not a spell", async () => {
    // when
    const poisonCheck = await action.check(testBuilder.createRequest(RequestType.Cast, TEST_INPUT_POISON))

    // then
    expect(poisonCheck.result).toBe(ConditionMessages.Cast.SpellNotKnown)
    expect(poisonCheck.status).toBe(CheckStatus.Failed)

    // and when
    const floodleCheck = await action.check(testBuilder.createRequest(RequestType.Cast, TEST_INPUT_INVALID))

    // then
    expect(floodleCheck.result).toBe(ConditionMessages.Cast.NotASpell)
    expect(floodleCheck.status).toBe(CheckStatus.Failed)
  })

  it("should display an appropriate result if the caster lacks mana", async () => {
    // given
    await testBuilder.withPlayer(p => {
      p.sessionMob.specializationType = SpecializationType.Cleric
      p.sessionMob.spells.push(newSpell(SpellType.Shield))
      p.sessionMob.vitals.mana = 0
      p.sessionMob.level = 30
    })

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Cast, TEST_INPUT_SHIELD))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(SkillMessages.All.NotEnoughMana)
  })
})
