import { getTestMob } from "../test/mob"
import { getTestRoom } from "../test/room"
import { Direction } from "./constants"
import { newReciprocalExit } from "./factory"
import { moveMob, persistAll, persistRoom } from "./service"

describe("moveMob", () => {
  it("should not allow movement where an exit does not exist", async () => {
    const mob = getTestMob()
    const source = getTestRoom()
    source.addMob(mob)
    expect.assertions(1)

    await persistRoom(source)
      .then(() => expect(moveMob(mob, Direction.North)).rejects.toThrowError())
  })

  it("should allow movement where a direction exists", async () => {
    const mob = getTestMob()
    const source = getTestRoom()
    const destination = getTestRoom()
    const exits = newReciprocalExit(Direction.North, source, destination)
    source.addMob(mob)
    expect.assertions(1)

    await persistAll([source, destination], exits)
      .then(() => moveMob(mob, Direction.North)
      .then(() => expect(mob.room.id).toBe(destination.id)))
  })
})
