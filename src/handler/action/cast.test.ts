import { createCastRequest } from "../../request/factory"
import { MESSAGE_NOT_ENOUGH_MANA } from "../../spell/check"
import { newSpell } from "../../spell/factory"
import { SpellType } from "../../spell/spellType"
import { getTestPlayer } from "../../test/player"
import cast, { MESSAGE_ERROR, MESSAGE_FAIL, MESSAGE_NO_SPELL, MESSAGE_SPELL_DOES_NOT_EXIST } from "./cast"

const TEST_INPUT_GIANT = "cast giant"
const TEST_INPUT_CAST = "cast"
const TEST_INPUT_POISON = "cast poison"
const TEST_INPUT_INVALID = "cast floodle"

describe("cast", () => {
  it("should require at least one argument", async () => {
    // when
    const response = await cast(createCastRequest(getTestPlayer(), TEST_INPUT_CAST))

    // then
    expect(response.message).toBe(MESSAGE_NO_SPELL)
  })

  it("should know if an argument is or is not a spell", async () => {
    // given
    const player = getTestPlayer()

    // when
    const poisonResponse = await cast(createCastRequest(player, TEST_INPUT_POISON))

    // then
    expect(poisonResponse.message).toBe(MESSAGE_ERROR)

    // when
    const floodleResponse = await cast(createCastRequest(player, TEST_INPUT_INVALID))

    // then
    expect(floodleResponse.message).toBe(MESSAGE_SPELL_DOES_NOT_EXIST)
  })

  it("should be able to cast a known spell", async () => {
    // given
    const player = getTestPlayer()
    const spell = newSpell(SpellType.GiantStrength)
    player.sessionMob.spells.push(spell)

    // when
    const response1 = await cast(createCastRequest(player, TEST_INPUT_GIANT))

    // then - *should* lose concentration
    expect(response1.message === MESSAGE_FAIL || response1.message.startsWith("You utter the words,")).toBeTruthy()

    // when
    spell.level = 100
    player.sessionMob.vitals.mana = 100
    const response2 = await cast(createCastRequest(player, TEST_INPUT_GIANT))

    // then - *should* succeed
    expect(response2.message === MESSAGE_FAIL || response2.message.startsWith("You utter the words,")).toBeTruthy()
  })

  it("should display an appropriate message if the caster lacks mana", async () => {
    // given
    const player = getTestPlayer()
    player.sessionMob.spells.push(newSpell(SpellType.GiantStrength))
    player.sessionMob.vitals.mana = 0

    // when
    const response = await cast(createCastRequest(player, TEST_INPUT_GIANT))

    // then
    expect(response.message).toBe(MESSAGE_NOT_ENOUGH_MANA)
  })
})
