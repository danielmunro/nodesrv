import { CheckStatus } from "../../check/checkStatus"
import { addFight, Fight } from "../../mob/fight/fight"
import { RequestType } from "../../request/requestType"
import { getTestMob } from "../../test/mob"
import TestBuilder from "../../test/testBuilder"
import { MESSAGE_FAIL_KILL_ALREADY_FIGHTING, MESSAGE_FAIL_KILL_NO_TARGET } from "./constants"
import { default as kill} from "./kill"

describe("kill", () => {
  it("should not be able to kill a mob that isn't in the room", async () => {
    // given
    const testBuilder = new TestBuilder()

    // and -- mob is NOT added to room
    const target = getTestMob()

    // when
    const check = await kill(testBuilder.createRequest(RequestType.Kill, `kill ${target.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_KILL_NO_TARGET)
  })

  it("shouldn't be able to target a mob when already fighting", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withRoom()
    const playerBuilder = await testBuilder.withPlayer()
    const player = playerBuilder.player
    const mob1 = testBuilder.withMob("bob").mob
    const mob2 = testBuilder.withMob("alice").mob

    // and
    addFight(new Fight(player.sessionMob, mob1, testBuilder.room))

    // when
    const check = await kill(testBuilder.createRequest(RequestType.Kill, `kill ${mob2.name}`, mob2))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_KILL_ALREADY_FIGHTING)
  })

  it("should be able to kill a mob in the same room", async () => {
    // given
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    const target = testBuilder.withMob("bob").mob

    // when
    const check = await kill(testBuilder.createRequest(RequestType.Kill, `kill ${target.name}`, target))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result.id).toBe(target.id)
  })
})
