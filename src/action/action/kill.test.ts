import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import { CheckStatus } from "../../check/checkStatus"
import { Player } from "../../player/model/player"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import kill from "./kill"

function useKillRequest(player: Player, target, input: string) {
  return kill(new CheckedRequest(
    testBuilder.createRequest(RequestType.Kill, input, target),
    new Check(CheckStatus.Ok, target, [])))
}

let testBuilder: TestBuilder

beforeEach(() => testBuilder = new TestBuilder())

describe("kill", () => {
  it("should be able to kill a mob in the same room", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.player.sessionMob.name = "alice"
    const target = testBuilder.withMob("bob").mob

    // when
    const response = await useKillRequest(playerBuilder.player, target, `kill ${target.name}`)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message.getMessageToRequestCreator()).toBe("you scream and attack bob!")
    expect(response.message.getMessageToTarget()).toBe("alice screams and attacks you!")
    expect(response.message.getMessageToObservers()).toBe("alice screams and attacks bob!")
  })
})
