import { Direction } from "../room/constants"
import { newReciprocalExit } from "../room/factory"
import { getTestMob } from "../test/mob"
import { getTestRoom } from "../test/room"
import Service from "./service"

describe("moveMob", () => {
  it("should not allow movement where an exit does not exist", async () => {
    const source = getTestRoom()
    const service = await Service.new()
    const mob = getTestMob()
    source.addMob(mob)
    await service.saveRoom(source)
    return expect(service.moveMob(mob, Direction.North)).rejects.toThrowError()
  })

  it("should allow movement where a direction exists", async () => {
    const mob = getTestMob()
    const source = getTestRoom()
    const destination = getTestRoom()
    const exits = newReciprocalExit(source, destination, Direction.North)
    source.addMob(mob)
    const allRooms = [source, destination]
    const service = await Service.newWithArray(allRooms)
    await service.saveRoom(allRooms)
    await service.saveExit(exits)
    await service.moveMob(mob, Direction.North)
    expect(mob.room.id).toBe(destination.id)
  })
})
