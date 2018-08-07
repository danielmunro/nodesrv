import { Direction } from "../../room/constants"
import { newExit } from "../../room/factory"
import Service from "../../room/service"
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
    const exit = newExit(Direction.South, source, destination)
    const wander = new Wander(() => Promise.resolve([mob]))
    const service = await Service.new()
    await service.saveRoom([source, destination])
    await service.saveExit(exit)

    // when
    await wander.notify([])

    // then
    expect(mob.room.name).toBe(destination.name)
  })
})
