import {createTestAppContainer} from "../../app/factory/testFactory"
import {MobEntity} from "../../mob/entity/mobEntity"
import LocationService from "../../mob/service/locationService"
import MobTable from "../../mob/table/mobTable"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import { Wander } from "./wander"

let testRunner: TestRunner
let locationService: LocationService
let mob: MobEntity
let wander: Wander

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  locationService = app.get<LocationService>(Types.LocationService)
  mob = (await testRunner.createMob()).get()
  wander = new Wander(new MobTable([mob]), locationService)
})

describe("wander server observer", () => {
  it("should cause a mob to move", async () => {
    // given
    const destinationRoom = testRunner.createRoom().get()
    mob.traits.wanders = true
    const initialRoom = locationService.getLocationForMob(mob).room

    // expect
    expect(initialRoom.uuid).toBe(testRunner.getStartRoom().get().uuid)

    // when
    await wander.notify()

    // then
    const location = locationService.getLocationForMob(mob)
    expect(location.room.uuid).toBe(destinationRoom.uuid)
  })

  it("can handle a room with no exits", async () => {
    // given
    mob.traits.wanders = true
    const initialLocation = locationService.getLocationForMob(mob)

    // expect
    expect(initialLocation.room.uuid).toBe(testRunner.getStartRoom().get().uuid)

    // when
    await wander.notify()

    // then
    const location = locationService.getLocationForMob(mob)
    expect(location.uuid).toBe(initialLocation.uuid)
  })
})
