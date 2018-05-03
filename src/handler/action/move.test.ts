import { newTrail } from "../../area/factory"
import { Direction } from "../../room/constants"
import { persistRoom } from "../../room/service"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import move, { MESSAGE_DIRECTION_DOES_NOT_EXIST } from "./move"

describe("move", () => {
  it("should not allow movement where an exit does not exist", async () => {
    expect.assertions(1)
    await move(getTestPlayer(), Direction.North)
      .then((response) => expect(response.message).toBe(MESSAGE_DIRECTION_DOES_NOT_EXIST))
  })

  it("should allow movement where rooms connect", async () => {
    const root = await persistRoom(getTestRoom())
    const trail = await newTrail(root, Direction.East, 1)
    const player = getTestPlayer()
    const mob = player.sessionMob
    root.addMob(mob)
    expect.assertions(1)
    await move(player, Direction.East)
      .then((response) => expect(mob.room.id).toBe(trail[0].id))
  })
})
