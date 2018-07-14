import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { Direction } from "../../room/constants"
import { getTestPlayer } from "../../test/player"
import { CheckStatus } from "../check"
import move from "./move"
import { MESSAGE_DIRECTION_DOES_NOT_EXIST } from "./move"

describe("move", () => {
  it("should not allow movement where an exit does not exist", async () => {
    // when
    const check = await move(new Request(getTestPlayer(), RequestType.North), Direction.North)

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_DIRECTION_DOES_NOT_EXIST)
  })
})
