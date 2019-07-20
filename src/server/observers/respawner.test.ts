import {createTestAppContainer} from "../../app/factory/testFactory"
import ResetService from "../../gameService/resetService"
import {Disposition} from "../../mob/enum/disposition"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import Respawner from "./respawner"

describe("respawner", () => {
  it("should reset dispositions for dead mobs", async () => {
    // setup
    const app = await createTestAppContainer()
    const testRunner = app.get<TestRunner>(Types.TestRunner)
    const startRoom = testRunner.getStartRoom().get()

    // dead
    const mob1 = await testRunner.createMob()
    mob1.withDisposition(Disposition.Dead)

    // dead
    const mob2 = await testRunner.createMob()
    mob2.withDisposition(Disposition.Dead)

    // not dead
    await testRunner.createMob()

    // given
    const locationService = app.get<LocationService>(Types.LocationService)
    const mobService = app.get<MobService>(Types.MobService)
    const respawner = new Respawner(app.get<ResetService>(Types.ResetService))
    await respawner.seedMobTable()

    // when
    await respawner.notify()

    const mobs = mobService.mobTable.getMobs()
    expect(mobs.every(mob =>
      mob.disposition === Disposition.Standing && locationService.getLocationForMob(mob).room === startRoom))
  }, 20000)
})
