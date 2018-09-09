import { addFight, Fight, getFights, reset } from "../mob/fight/fight"
import { createCastRequest } from "../request/factory"
import { getTestClient } from "../test/client"
import { getTestMob } from "../test/mob"
import { Check } from "./check"
import { newSpell } from "./factory"
import spellCollection from "./spellCollection"
import { SpellDefinition } from "./spellDefinition"
import { SpellType } from "./spellType"

beforeEach(() => reset())

function getMagicMissile(): SpellDefinition {
  return spellCollection.findSpell(SpellType.MagicMissile)
}

describe("spellDefinition", () => {
  it("should be able to create a check with a request", async () => {
    const client = await getTestClient()
    const check = new Check(
      createCastRequest(client.player, "cast 'magic missile'"),
      getMagicMissile())
    expect(check.caster).toBe(client.player.sessionMob)
    expect(check.isError()).toBe(true)
  })

  it("should be able to successfully cast 'magic missile' against a target in a battle", async () => {
    const client = await getTestClient()
    client.player.sessionMob.spells.push(newSpell(SpellType.MagicMissile, 1))
    const target = getTestMob()
    addFight(new Fight(client.player.sessionMob, target))
    const check = new Check(
      createCastRequest(client.player, "cast 'magic missile'"),
      getMagicMissile())
    expect(check.isError()).toBe(false)
    expect(check.isFailure() || check.isSuccessful()).toBe(true)
  })

  it("should be able to successfully cast 'magic missile', and create a new fight", async () => {
    const spell = getMagicMissile()
    const client = await getTestClient()
    const sessionMob = client.player.sessionMob
    sessionMob.spells.push(newSpell(SpellType.MagicMissile, 1))
    const target = getTestMob("foo")
    sessionMob.room.addMob(target)
    const check = new Check(
      createCastRequest(client.player, "cast 'magic missile' foo", target),
      getMagicMissile())
    expect(check.isError()).toBe(false)
    expect(check.isFailure() || check.isSuccessful()).toBe(true)
    spell.apply(check)
    expect(getFights().find((f) => f.isParticipant(sessionMob))).toBeTruthy()
  })

  it("will not target if the name mismatches", async () => {
    const client = await getTestClient()
    client.player.sessionMob.spells.push(newSpell(SpellType.MagicMissile, 1))
    const target = getTestMob("foo")
    client.player.sessionMob.room.addMob(target)
    const check = new Check(
      createCastRequest(client.player, "cast 'magic missile' bar"),
      getMagicMissile())
    expect(check.isError()).toBe(true)
  })
})
