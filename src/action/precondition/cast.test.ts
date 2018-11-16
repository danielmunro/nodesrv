import { CheckStatus } from "../../check/checkStatus"
import { RequestType } from "../../request/requestType"
import { Messages } from "../../skill/precondition/constants"
import { newSpell } from "../../spell/factory"
import { SpellType } from "../../spell/spellType"
import TestBuilder from "../../test/testBuilder"
import cast from "./cast"
import { MESSAGE_NO_SPELL, MESSAGE_SPELL_DOES_NOT_EXIST } from "./constants"

const TEST_INPUT_GIANT = "cast giant"
const TEST_INPUT_CAST = "cast"
const TEST_INPUT_POISON = "cast poison"
const TEST_INPUT_INVALID = "cast floodle"

describe("cast", () => {
  it("should require at least one argument", async () => {
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()

    // when
    const check = await cast(testBuilder.createRequest(RequestType.Cast, TEST_INPUT_CAST))

    // then
    expect(check.result).toBe(MESSAGE_NO_SPELL)
    expect(check.status).toBe(CheckStatus.Failed)
  })

  it("should know if an argument is or is not a spell", async () => {
    // given
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()

    // when
    const poisonCheck = await cast(testBuilder.createRequest(RequestType.Cast, TEST_INPUT_POISON))

    // then
    expect(poisonCheck.result).toBe(Messages.All.NoSpell)
    expect(poisonCheck.status).toBe(CheckStatus.Failed)

    // when
    const floodleCheck = await cast(testBuilder.createRequest(RequestType.Cast, TEST_INPUT_INVALID))

    // then
    expect(floodleCheck.result).toBe(MESSAGE_SPELL_DOES_NOT_EXIST)
    expect(floodleCheck.status).toBe(CheckStatus.Failed)
  })

  it("should be able to cast a known spell", async () => {
    const testBuilder = new TestBuilder()

    // given
    await testBuilder.withPlayer(p => {
      p.sessionMob.spells.push(newSpell(SpellType.GiantStrength))
      p.sessionMob.level = 20
    })

    // when
    const check = await cast(testBuilder.createRequest(RequestType.Cast, TEST_INPUT_GIANT))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
  })

  it("should display an appropriate result if the caster lacks mana", async () => {
    const testBuilder = new TestBuilder()

    // given
    await testBuilder.withPlayer(p => {
      p.sessionMob.spells.push(newSpell(SpellType.GiantStrength))
      p.sessionMob.vitals.mana = 0
      p.sessionMob.level = 10
    })

    // when
    const check = await cast(testBuilder.createRequest(RequestType.Cast, TEST_INPUT_GIANT))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(Messages.All.NotEnoughMana)
  })
})
