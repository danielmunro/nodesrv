import {CheckStatus} from "../../check/checkStatus"
import {SpecializationType} from "../../mob/specialization/specializationType"
import {RequestType} from "../../request/requestType"
import {Messages as SkillMessages} from "../../skill/precondition/constants"
import {Spell} from "../../spell/model/spell"
import {SpellType} from "../../spell/spellType"
import TestBuilder from "../../test/testBuilder"
import cast from "./cast"
import {Messages} from "./constants"

const TEST_INPUT_GIANT = "cast giant"
const TEST_INPUT_CAST = "cast"
const TEST_INPUT_POISON = "cast poison"
const TEST_INPUT_INVALID = "cast floodle"

let testBuilder: TestBuilder

async function castAction(input: string) {
  return cast(testBuilder.createRequest(RequestType.Cast, input), await testBuilder.getService())
}

function newSpell(spellType: SpellType) {
  const spell = new Spell()
  spell.spellType = spellType

  return spell
}

beforeEach(() => testBuilder = new TestBuilder())

describe("cast", () => {
  it("should require at least one argument", async () => {
    // when
    const check = await castAction(TEST_INPUT_CAST)

    // then
    expect(check.result).toBe(Messages.All.Arguments.Cast)
    expect(check.status).toBe(CheckStatus.Failed)
  })

  it("should know if an argument is or is not a spell", async () => {
    // when
    const poisonCheck = await castAction(TEST_INPUT_POISON)

    // then
    expect(poisonCheck.result).toBe(Messages.Cast.SpellNotKnown)
    expect(poisonCheck.status).toBe(CheckStatus.Failed)

    // and when
    const floodleCheck = await castAction(TEST_INPUT_INVALID)

    // then
    expect(floodleCheck.result).toBe(Messages.Cast.NotASpell)
    expect(floodleCheck.status).toBe(CheckStatus.Failed)
  })

  it("should be able to cast a known spell", async () => {
    // given
    await testBuilder.withPlayer(p => {
      p.sessionMob.spells.push(newSpell(SpellType.GiantStrength))
      p.sessionMob.level = 20
    })

    // when
    const check = await castAction(TEST_INPUT_GIANT)

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
    const check = await castAction(TEST_INPUT_GIANT)

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(SkillMessages.All.NotEnoughMana)
  })
})
