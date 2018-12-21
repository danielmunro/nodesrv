import { newMobLocation } from "../../mob/factory"
import LocationService from "../../mob/locationService"
import { Direction } from "../../room/constants"
import { newExit } from "../../room/factory"
import { getTestMob } from "../../test/mob"
import { getTestRoom } from "../../test/room"
import { Wander } from "./wander"

describe("wander", () => {
  it("should cause a mob to move", async () => {
    const mob = getTestMob()

    // given
    mob.traits.wanders = true
    const source = getTestRoom()
    source.name = "room 1"
    const destination = getTestRoom()
    destination.name = "room 2"
    newExit(Direction.South, source, destination)
    const locationService = new LocationService([
      newMobLocation(mob, source),
    ])
    const wander = new Wander([mob], locationService)

    // when
    await wander.notify([])

    // then
    expect(locationService.getLocationForMob(mob).room.name).toBe(destination.name)
  })
})
