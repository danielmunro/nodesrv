import { newTrail } from "../../area/builder/forest/trail"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import { Direction } from "../../room/constants"
import { persistRoom } from "../../room/service"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import move, { MESSAGE_DIRECTION_DOES_NOT_EXIST } from "./move"

describe("move", () => {
  it("should not allow movement where an exit does not exist", async () => {
    // when
    const response = await move(new Request(getTestPlayer(), RequestType.North), Direction.North)

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.message).toBe(MESSAGE_DIRECTION_DOES_NOT_EXIST)
  })

  it("should allow movement where rooms connect", async () => {
    // given
    const root = await persistRoom(getTestRoom())
    const trail = await newTrail(root, Direction.East, 1)
    const player = getTestPlayer()
    const mob = player.sessionMob
    root.addMob(mob)

    // when
    const response = await move(new Request(player, RequestType.East), Direction.East)

    // then
    expect(response.status).toBe(ResponseStatus.Info)
    expect(mob.room.id).toBe(trail[1].id)
  })
})
