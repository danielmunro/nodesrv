import { createCastRequest } from "../../server/request/factory"
import { createRequestArgs, Request } from "../../server/request/request"
import { MESSAGE_NOT_ENOUGH_MANA } from "../../spell/check"
import { newSpell } from "../../spell/factory"
import { SpellType } from "../../spell/spellType"
import { getTestPlayer } from "../../test/player"
import { RequestType } from "../constants"
import cast, { MESSAGE_ERROR, MESSAGE_FAIL, MESSAGE_NO_SPELL, MESSAGE_SPELL_DOES_NOT_EXIST } from "./cast"

describe("cast", () => {
  it("should require at least one argument", async () => {
    expect.assertions(1)
    await cast(createCastRequest(getTestPlayer(), "cast"))
      .then((response) => expect(response.message).toBe(MESSAGE_NO_SPELL))
  })

  it("should know if an argument is or is not a spell", async () => {
    expect.assertions(2)
    const player = getTestPlayer()
    await cast(createCastRequest(player, "cast poison"))
      .then((response) => expect(response.message).toBe(MESSAGE_ERROR))
    await cast(createCastRequest(player, "cast floodle"))
      .then((response) => expect(response.message).toBe(MESSAGE_SPELL_DOES_NOT_EXIST))
  })

  it("should be able to cast a known spell", async () => {
    const player = getTestPlayer()
    const spell = newSpell(SpellType.GiantStrength)
    player.sessionMob.spells.push(spell)
    expect.assertions(2)

    // *should* lose concentration
    await cast(createCastRequest(player, "cast giant"))
      .then((response) =>
        expect(response.message === MESSAGE_FAIL || response.message.startsWith("You utter the words,")).toBeTruthy())

    // *should* succeed
    spell.level = 100
    player.sessionMob.vitals.mana = 100
    await cast(createCastRequest(player, "cast giant"))
      .then((response) =>
        expect(response.message === MESSAGE_FAIL || response.message.startsWith("You utter the words,")).toBeTruthy())
  })

  it("should display an appropriate message if the caster lacks mana", async () => {
    const player = getTestPlayer()
    player.sessionMob.spells.push(newSpell(SpellType.GiantStrength))
    player.sessionMob.vitals.mana = 0
    expect.assertions(1)
    await cast(createCastRequest(player, "cast giant"))
      .then((response) =>
        expect(response.message).toBe(MESSAGE_NOT_ENOUGH_MANA))
  })
})
