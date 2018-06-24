import { Player } from "../../player/model/player"
import { createRequestArgs, Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestPlayer } from "../../test/player"
import { CheckStatus } from "../check"
import remove, { MESSAGE_REMOVE_FAIL } from "./remove"

function useRemoveRequest(player: Player, input: string) {
  return remove(new Request(player, RequestType.Remove, createRequestArgs(input)))
}

describe("remove", () => {
  it("should not work if an item is not equipped", async () => {
    // when
    const check = await useRemoveRequest(getTestPlayer(), "remove foo")

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.message).toBe(MESSAGE_REMOVE_FAIL)
  })
})
