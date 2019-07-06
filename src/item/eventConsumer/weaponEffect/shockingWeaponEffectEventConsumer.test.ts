import {createTestAppContainer} from "../../../app/factory/testFactory"
import {createDamageEvent} from "../../../event/factory/eventFactory"
import EventService from "../../../event/service/eventService"
import {DamageType} from "../../../mob/fight/enum/damageType"
import LocationService from "../../../mob/service/locationService"
import Response from "../../../request/response"
import ClientService from "../../../server/service/clientService"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {WeaponEffect} from "../../enum/weaponEffect"
import WeaponEffectService from "../../service/weaponEffectService"
import ShockingWeaponEffectEventConsumer from "./shockingWeaponEffectEventConsumer"

let testRunner: TestRunner
let eventService: EventService
let locationService: LocationService
let mob1: MobBuilder
let mob2: MobBuilder
let eventConsumer: ShockingWeaponEffectEventConsumer

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  mob1 = testRunner.createMob()
  mob2 = testRunner.createMob().equip(
    testRunner.createWeapon().asAxe().addWeaponEffect(WeaponEffect.Shocking).build())
  eventConsumer = new ShockingWeaponEffectEventConsumer(app.get<WeaponEffectService>(Types.WeaponEffectService))
  eventService = app.get<EventService>(Types.EventService)
  locationService = app.get<LocationService>(Types.LocationService)
})

describe("shocking weapon effect event consumer", () => {
  it("increases the damage modifier", async () => {
    // given
    const modifier = 1

    // when
    const eventResponse = await eventConsumer.consume(createDamageEvent(
      mob1.get(), 1, DamageType.Slash, modifier, mob2.get()))

    // then
    expect(eventResponse.event.modifier).toBeGreaterThan(modifier)
  })

  it("generates correct success messages", async () => {
    // setup
    let response: Response
    const mock = jest.fn(() => ({
      sendResponseToRoom: (res: Response) => {
        response = res
      },
    }))
    eventConsumer = new ShockingWeaponEffectEventConsumer(
      new WeaponEffectService(
        eventService,
        locationService,
        mock() as ClientService))

    // given
    const event = createDamageEvent(mob1.get(), 1, DamageType.Slash, 1, mob2.get())

    // when
    await eventConsumer.consume(event)

    // then
    expect(response).toBeDefined()
    expect(response.getMessageToRequestCreator()).toBe(`a wood chopping axe shocks ${mob1.getMobName()}!`)
    expect(response.getMessageToTarget()).toBe("a wood chopping axe shocks you!")
    expect(response.getMessageToRequestCreator()).toBe(`a wood chopping axe shocks ${mob1.getMobName()}!`)
  })
})
