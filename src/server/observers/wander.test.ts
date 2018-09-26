import { Direction } from "../../room/constants"
import { newExit } from "../../room/factory"
import Service from "../../service/service"
import { getTestMob } from "../../test/mob"
import { getTestRoom } from "../../test/room"
import { Wander } from "./wander"

describe("wander", () => {
  it("should cause a mob to move", async () => {
    // given
    const mob = getTestMob()
    mob.wanders = true
    const source = mob.room
    source.name = "room 1"
    const destination = getTestRoom()
    destination.name = "room 2"
    const allRooms = [source, destination]
    const exit = newExit(Direction.South, source, destination)
    const service = await Service.newWithArray(allRooms)
    const wander = new Wander(service, [mob])
    await service.saveRoom(allRooms)
    await service.saveExit(exit)

    // when
    await wander.notify([])

    // then
    expect(mob.room.name).toBe(destination.name)
  })
})
