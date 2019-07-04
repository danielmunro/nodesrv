import {createTestAppContainer} from "../../../app/factory/testFactory"
import EventResponse from "../../../event/eventResponse"
import {createDamageEvent} from "../../../event/factory/eventFactory"
import {DamageType} from "../../../mob/fight/enum/damageType"
import {RaceType} from "../../../mob/race/enum/raceType"
import LocationService from "../../../mob/service/locationService"
import Response from "../../../request/response"
import ClientService from "../../../server/service/clientService"
import doNTimes from "../../../support/functional/times"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {WeaponEffect} from "../../enum/weaponEffect"
import FrostWeaponEffectEventConsumer from "./frostWeaponEffectEventConsumer"

let testRunner: TestRunner
let locationService: LocationService
let eventConsumer: FrostWeaponEffectEventConsumer
let mob1: MobBuilder
let mob2: MobBuilder
const iterations = 100

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  locationService = app.get<LocationService>(Types.LocationService)
  eventConsumer = new FrostWeaponEffectEventConsumer(
    locationService,
    app.get<ClientService>(Types.ClientService))
  mob1 = testRunner.createMob().setRace(RaceType.Halfling)
  mob2 = testRunner.createMob()
    .equip(testRunner.createWeapon()
      .asAxe()
      .addWeaponEffect(WeaponEffect.Frost)
      .build())
})

describe("frost weapon effect event consumer", () => {
  it("freeze mobs that are vulnerable to freezing", async () => {
    // given
    const event = createDamageEvent(mob1.get(), 1, DamageType.Slash, 1, mob2.get())

    // when
    const eventResponses: EventResponse[] =
      await doNTimes(iterations, () => eventConsumer.consume(event))

    // then
    expect(eventResponses.find(eventResponse => eventResponse.event.modifier > 1)).toBeDefined()
  })

  it("generates correct success messages", async () => {
    // setup
    let response: Response
    const mock = jest.fn(() => ({
      sendResponseToRoom: (res: Response) => {
        response = res
      },
    }))
    eventConsumer = new FrostWeaponEffectEventConsumer(
      locationService,
      mock() as ClientService)

    // given
    const event = createDamageEvent(mob1.get(), 1, DamageType.Slash, 1, mob2.get())

    // when
    await doNTimes(iterations, () => eventConsumer.consume(event))

    // then
    expect(response).toBeDefined()
    expect(response.getMessageToRequestCreator()).toBe(`a wood chopping axe freezes ${mob1.getMobName()}!`)
    expect(response.getMessageToTarget()).toBe("a wood chopping axe freezes you!")
    expect(response.getMessageToRequestCreator()).toBe(`a wood chopping axe freezes ${mob1.getMobName()}!`)
  })
})
