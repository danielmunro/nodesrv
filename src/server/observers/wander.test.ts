import {createTestAppContainer} from "../../app/testFactory"
import LocationService from "../../mob/locationService"
import MobTable from "../../mob/mobTable"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import { Wander } from "./wander"

describe("wander", () => {
  it("should cause a mob to move", async () => {
    // setup
    const app = await createTestAppContainer()
    const testRunner = app.get<TestRunner>(Types.TestRunner)
    const locationService = app.get<LocationService>(Types.LocationService)
    testRunner.createRoom()
    const mob = testRunner.createMob().get()
    const room = testRunner.createRoom().get()

    // given
    mob.traits.wanders = true
    const wander = new Wander(new MobTable([mob]), locationService)
    const initialRoom = locationService.getLocationForMob(mob)

    // expect
    expect(initialRoom.room.uuid).toBe(testRunner.getStartRoom().get().uuid)

    // when
    await wander.notify()

    // then
    const location = locationService.getLocationForMob(mob)
    expect(location.room.uuid).not.toBe(room.uuid)
  })
})
