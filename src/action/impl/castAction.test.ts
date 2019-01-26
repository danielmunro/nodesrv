import {CheckStatus} from "../../check/checkStatus"
import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import {allDispositions, Disposition} from "../../mob/enum/disposition"
import {SpecializationType} from "../../mob/specialization/specializationType"
import {RequestType} from "../../request/requestType"
import {ResponseStatus} from "../../request/responseStatus"
import {ConditionMessages as SkillMessages} from "../../skill/constants"
import {Spell} from "../../spell/model/spell"
import {SpellType} from "../../spell/spellType"
import TestBuilder from "../../test/testBuilder"
import Action from "../action"
import {ConditionMessages} from "../constants"

const TEST_INPUT_GIANT = "cast giant"
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
  action = await testBuilder.getActionDefinition(RequestType.Cast)
})

describe("cast action action", () => {
  it("should be able to cast a known spell", async () => {
    // given
    const mobBuilder = testBuilder.withMob()
    mobBuilder.withSpell(SpellType.GiantStrength, MAX_PRACTICE_LEVEL)
    mobBuilder.withLevel(20)
    const definition = await testBuilder.getSpellDefinition(SpellType.GiantStrength)

    // when
    const response = await definition.doAction(testBuilder.createRequest(RequestType.Cast, TEST_INPUT_GIANT))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
  })

  it("should not be able to cast if not standing", async () => {
    // setup
    const mobBuilder = testBuilder.withMob()
    mobBuilder.withSpell(SpellType.GiantStrength, MAX_PRACTICE_LEVEL)
    mobBuilder.withLevel(20)

    for (const disposition of allDispositions) {
      // given
      mobBuilder.withDisposition(disposition)

      // when
      const check = await action.check(testBuilder.createRequest(RequestType.Cast, TEST_INPUT_GIANT))

      // then
      expect(check.status).toBe(
        disposition === Disposition.Standing ?
          CheckStatus.Ok : CheckStatus.Failed)
    }
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

  it("should be able to cast a known spell", async () => {
    // given
    await testBuilder.withPlayer(p => {
      p.sessionMob.spells.push(newSpell(SpellType.GiantStrength))
      p.sessionMob.level = 20
    })

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Cast, TEST_INPUT_GIANT))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
  })

  it("should display an appropriate result if the caster lacks mana", async () => {
    // given
    await testBuilder.withPlayer(p => {
      p.sessionMob.specialization = SpecializationType.Cleric
      p.sessionMob.spells.push(newSpell(SpellType.GiantStrength))
      p.sessionMob.vitals.mana = 0
      p.sessionMob.level = 30
    })

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Cast, TEST_INPUT_GIANT))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(SkillMessages.All.NotEnoughMana)
  })
})
