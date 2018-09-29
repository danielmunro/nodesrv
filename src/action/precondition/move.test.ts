import { CheckStatus } from "../../check/checkStatus"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { Direction } from "../../room/constants"
import { newReciprocalExit } from "../../room/factory"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import { MESSAGE_DIRECTION_DOES_NOT_EXIST } from "./constants"
import { MESSAGE_OUT_OF_MOVEMENT } from "./constants"
import move from "./move"

describe("move", () => {
  it("should not allow movement where an exit does not exist", async () => {
    // when
    const check = await move(new Request(getTestPlayer(), RequestType.North), Direction.North)

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_DIRECTION_DOES_NOT_EXIST)
  })

  it("should not allow movement when movement points are depleted", async () => {
    // given
    const player = getTestPlayer()
    player.sessionMob.vitals.mv = 0
    const room1 = getTestRoom()
    const room2 = getTestRoom()
    newReciprocalExit(room1, room2, Direction.South)
    room1.addMob(player.sessionMob)

    // when
    const check = await move(new Request(player, RequestType.South), Direction.South)

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_OUT_OF_MOVEMENT)
  })

  it("should allow movement when preconditions pass", async () => {
    // given
    const player = getTestPlayer()
    const room1 = getTestRoom()
    const room2 = getTestRoom()
    newReciprocalExit(room1, room2, Direction.South)
    room1.addMob(player.sessionMob)

    // when
    const check = await move(new Request(player, RequestType.South), Direction.South)

    // then
    expect(check.status).toBe(CheckStatus.Ok)
  })
})
