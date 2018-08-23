import { addFight, Fight } from "../../mob/fight/fight"
import { Player } from "../../player/model/player"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestMob } from "../../test/mob"
import TestBuilder from "../../test/testBuilder"
import { CheckStatus } from "../check"
import { default as kill, MESSAGE_FAIL_KILL_ALREADY_FIGHTING, MESSAGE_FAIL_KILL_NO_TARGET } from "./kill"

function useKillRequest(player: Player, input: string) {
  return kill(new Request(player, RequestType.Kill, input))
}

describe("kill", () => {
  it("should not be able to kill a mob that isn't in the room", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player

    // and -- mob is NOT added to room
    const target = getTestMob()

    // when
    const check = await useKillRequest(player, `kill ${target.name}`)

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_KILL_NO_TARGET)
  })

  it("shouldn't be able to target a mob when already fighting", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    const mob1 = testBuilder.withMob("bob").mob
    const mob2 = testBuilder.withMob("alice").mob

    // and
    addFight(new Fight(player.sessionMob, mob1))

    // when
    const check = await useKillRequest(player, `kill ${mob2.name}`)

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_KILL_ALREADY_FIGHTING)
  })

  it("should be able to kill a mob in the same room", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    const target = testBuilder.withMob("bob").mob

    // when
    const check = await useKillRequest(player, `kill ${target.name}`)

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result.id).toBe(target.id)
  })
})
