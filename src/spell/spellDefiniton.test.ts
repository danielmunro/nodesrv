import { addFight, Fight, getFights, reset } from "../mob/fight/fight"
import { createCastRequest } from "../request/factory"
import { newSpell } from "../spell/factory"
import { getTestClient } from "../test/client"
import { getTestMob } from "../test/mob"
import spellCollection from "./spellCollection"
import { SpellDefinition } from "./spellDefiniton"
import { SpellType } from "./spellType"

beforeEach(() => reset())

function getMagicMissile(): SpellDefinition {
  return spellCollection.findSpell(SpellType.MagicMissile)
}

describe("spellDefinition", () => {
  it("should be able to create a check with a request", () => {
    const client = getTestClient()
    const check = getMagicMissile()
      .check(createCastRequest(client.player, "cast 'magic missile'"))
    expect(check.caster).toBe(client.player.sessionMob)
    expect(check.isError()).toBe(true)
  })

  it("should be able to successfully cast 'magic missile' against a target in a battle", () => {
    const client = getTestClient()
    client.player.sessionMob.spells.push(newSpell(SpellType.MagicMissile, 1))
    const target = getTestMob()
    addFight(new Fight(client.player.sessionMob, target))
    const check = getMagicMissile().check(createCastRequest(client.player, "cast 'magic missile'"))
    expect(check.isError()).toBe(false)
    expect(check.isFailure() || check.isSuccessful()).toBe(true)
  })

  it("should be able to successfully cast 'magic missile' against a target in a room, and create a new fight", () => {
    const spell = getMagicMissile()
    const client = getTestClient()
    const sessionMob = client.player.sessionMob
    sessionMob.spells.push(newSpell(SpellType.MagicMissile, 1))
    const target = getTestMob("foo")
    sessionMob.room.addMob(target)
    const check = spell.check(createCastRequest(client.player, "cast 'magic missile' foo"))
    expect(check.isError()).toBe(false)
    expect(check.isFailure() || check.isSuccessful()).toBe(true)
    spell.apply(check)
    expect(getFights().find((f) => f.isParticipant(sessionMob))).toBeTruthy()
  })

  it("will not target if the name mismatches", () => {
    const spell = spellCollection.findSpell(SpellType.MagicMissile)
    const client = getTestClient()
    client.player.sessionMob.spells.push(newSpell(SpellType.MagicMissile, 1))
    const target = getTestMob("foo")
    client.player.sessionMob.room.addMob(target)
    const check = spell.check(createCastRequest(client.player, "cast 'magic missile' bar"))
    expect(check.isError()).toBe(true)
  })
})
