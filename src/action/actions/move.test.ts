import { newTrail } from "../../area/builder/forest/trail"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import { Direction } from "../../room/constants"
import Service from "../../service/service"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import move from "./move"

describe("move", () => {
  it("should allow movement where rooms connect", async () => {
    // given
    const root = getTestRoom()
    const trail = await newTrail(root, Direction.East, 1)
    const service = await Service.newWithArray([root, ...trail.getAllRooms()])
    await service.saveRoom(root)
    const player = getTestPlayer()
    const mob = player.sessionMob
    root.addMob(mob)

    // when
    const response = await move(
      new CheckedRequest(new Request(player, RequestType.East), await Check.ok()),
      Direction.East,
      service)

    // then
    expect(response.status).toBe(ResponseStatus.Info)
    expect(mob.room.id).toBe(trail.getAllRooms()[1].id)
  })
})
