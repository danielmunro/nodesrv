import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import { CheckStatus } from "../../check/checkStatus"
import roll from "../../random/dice"
import { createCastRequest } from "../../request/factory"
import { Request } from "../../request/request"
import { ResponseStatus } from "../../request/responseStatus"
import { Check as SpellCheck } from "../../spell/check"
import { newSpell } from "../../spell/factory"
import spellCollection from "../../spell/spellCollection"
import SpellDefinition from "../../spell/spellDefinition"
import { SpellType } from "../../spell/spellType"
import { getTestPlayer } from "../../test/player"
import cast from "./cast"

const TEST_INPUT_GIANT = "cast giant"

function createCheckedRequest(request: Request, spellDefinition: SpellDefinition) {
  return new CheckedRequest(
    request,
    new Check(
      roll(1, 2) % 2 === 0 ? CheckStatus.Ok : CheckStatus.Failed,
      new SpellCheck(request, spellDefinition)))
}

describe("cast action action", () => {
  it("should be able to cast a known spell", async () => {
    // given
    const player = getTestPlayer()
    const spell = newSpell(SpellType.GiantStrength)
    player.sessionMob.spells.push(spell)

    // when
    const response1 = await cast(
      createCheckedRequest(
        createCastRequest(player, TEST_INPUT_GIANT),
        spellCollection.findSpell(SpellType.GiantStrength)))

    // then - *should* lose concentration
    expect(response1.message.getMessageToRequestCreator().startsWith("you utter the words,")).toBeTruthy()
    expect(response1.status).toBe(ResponseStatus.Success)

    // when
    spell.level = 100
    player.sessionMob.vitals.mana = 100
    const response2 = await cast(
      createCheckedRequest(
        createCastRequest(player, TEST_INPUT_GIANT),
        spellCollection.findSpell(SpellType.GiantStrength)))

    // then - *should* succeed
    expect(response2.message.getMessageToRequestCreator().startsWith("you utter the words,")).toBeTruthy()
    expect(response2.status).toBe(ResponseStatus.Success)
  })
})
