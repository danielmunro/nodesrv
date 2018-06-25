import { createCastRequest } from "../../request/factory"
import { ResponseStatus } from "../../request/responseStatus"
import { newSpell } from "../../spell/factory"
import { SpellType } from "../../spell/spellType"
import { getTestPlayer } from "../../test/player"
import cast from "./cast"

const TEST_INPUT_GIANT = "cast giant"

describe("cast", () => {
  it("should be able to cast a known spell", async () => {
    // given
    const player = getTestPlayer()
    const spell = newSpell(SpellType.GiantStrength)
    player.sessionMob.spells.push(spell)

    // when
    const response1 = await cast(createCastRequest(player, TEST_INPUT_GIANT))

    // then - *should* lose concentration
    expect(response1.message.startsWith("You utter the words,")).toBeTruthy()
    expect(response1.status).toBe(ResponseStatus.Success)

    // when
    spell.level = 100
    player.sessionMob.vitals.mana = 100
    const response2 = await cast(createCastRequest(player, TEST_INPUT_GIANT))

    // then - *should* succeed
    expect(response2.message.startsWith("You utter the words,")).toBeTruthy()
    expect(response2.status).toBe(ResponseStatus.Success)
  })
})
