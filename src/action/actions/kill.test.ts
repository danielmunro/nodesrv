import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import { CheckStatus } from "../../check/checkStatus"
import { Player } from "../../player/model/player"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import { Messages } from "./constants"
import kill from "./kill"

function useKillRequest(player: Player, target, input: string) {
  return kill(new CheckedRequest(
    new Request(player.sessionMob, RequestType.Kill, input, target),
    new Check(CheckStatus.Ok, target, [])))
}

describe("kill", () => {
  it("should be able to kill a mob in the same room", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const target = testBuilder.withMob("bob").mob

    // when
    const response = await useKillRequest(playerBuilder.player, target, `kill ${target.name}`)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message).toBe(Messages.Kill.Success)
  })
})
