import { RequestType } from "../../request/requestType"
import { createRequestArgs, Request } from "../../request/request"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import { Check } from "../check"
import spellCollection from "../spellCollection"
import { SpellType } from "../spellType"
import lightningBolt from "./lightningBolt"

describe("lightning bolt", () => {
  it("should do damage when casted", () => {
    // setup
    const player = getTestPlayer()
    const mob = getTestMob("bob")
    const room = getTestRoom()
    room.addMob(player.sessionMob)
    room.addMob(mob)
    expect(mob.vitals.hp).toBe(mob.getCombinedAttributes().vitals.hp)

    // when
    lightningBolt(
      new Check(
        new Request(player, RequestType.Cast, createRequestArgs("cast 'lightning bolt' bob")),
        spellCollection.findSpell(SpellType.LightningBolt)))

    // then
    expect(mob.vitals.hp).toBeLessThan(mob.getCombinedAttributes().vitals.hp)
  })
})
