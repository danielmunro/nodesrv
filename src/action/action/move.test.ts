import { newTrail } from "../../area/builder/forest/trail"
import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import InputContext from "../../request/context/inputContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import { Direction } from "../../room/constants"
import Service from "../../service/service"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import move from "./move"
import { newReciprocalExit } from "../../room/factory"

describe("move", () => {
  it("should allow movement where rooms connect", async () => {
    // given
    const source = getTestRoom()
    const destination = getTestRoom()
    const exit = newReciprocalExit(source, destination)
    const service = await Service.newWithArray([source, destination], exit)
    const player = getTestPlayer()
    const mob = player.sessionMob
    source.addMob(mob)

    // when
    const response = await move(
      new CheckedRequest(new Request(mob, new InputContext(RequestType.East)), await Check.ok()),
      Direction.East,
      service)

    // then
    expect(response.status).toBe(ResponseStatus.Info)
    expect(mob.room.id).toBe(destination.id)
  })
})
