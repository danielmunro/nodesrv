import { Player } from "../../player/model/player"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import Check from "../check/check"
import CheckedRequest from "../check/checkedRequest"
import { ATTACK_MOB } from "./constants"
import kill from "./kill"
import { CheckStatus } from "../check/checkStatus"

function useKillRequest(player: Player, target, input: string) {
  return kill(new CheckedRequest(
    new Request(player, RequestType.Kill, input, target),
    new Check(CheckStatus.Ok, target)))
}

describe("kill", () => {
  it("should be able to kill a mob in the same room", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    const target = testBuilder.withMob("bob").mob

    // when
    const response = await useKillRequest(player, target, `kill ${target.name}`)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message).toBe(ATTACK_MOB)
  })
})
