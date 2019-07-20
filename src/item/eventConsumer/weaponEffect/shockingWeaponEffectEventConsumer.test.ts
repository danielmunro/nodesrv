import {createTestAppContainer} from "../../../app/factory/testFactory"
import {createDamageEvent} from "../../../event/factory/eventFactory"
import EventService from "../../../event/service/eventService"
import DamageEvent from "../../../mob/event/damageEvent"
import {DamageType} from "../../../mob/fight/enum/damageType"
import LocationService from "../../../mob/service/locationService"
import {doNTimesOrUntilTruthy} from "../../../support/functional/times"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {MaterialType} from "../../enum/materialType"
import {WeaponEffect} from "../../enum/weaponEffect"
import WeaponEffectService from "../../service/weaponEffectService"
import clientServiceMock from "./clientServiceMock"
import ShockingWeaponEffectEventConsumer from "./shockingWeaponEffectEventConsumer"

let testRunner: TestRunner
let eventService: EventService
let locationService: LocationService
let mob1: MobBuilder
let mob2: MobBuilder
let eventConsumer: ShockingWeaponEffectEventConsumer
const iterations = 100

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  mob1 = await testRunner.createMob()
  mob2 = (await testRunner.createMob()).equip(
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
    expect((eventResponse.event as DamageEvent).modifier).toBeGreaterThan(modifier)
  })

  it("generates correct success messages", async () => {
    // setup
    const mock = clientServiceMock()
    eventConsumer = new ShockingWeaponEffectEventConsumer(
      new WeaponEffectService(
        eventService,
        locationService,
        mock as any))

    // given
    const event = createDamageEvent(mob1.get(), 1, DamageType.Slash, 1, mob2.get())

    // when
    await eventConsumer.consume(event)

    // then
    const response = mock.getResponse()
    expect(response).toBeDefined()
    expect(response.getMessageToRequestCreator()).toBe(`a wood chopping axe shocks ${mob1.getMobName()}.`)
    expect(response.getMessageToTarget()).toBe("a wood chopping axe shocks you.")
    expect(response.getMessageToRequestCreator()).toBe(`a wood chopping axe shocks ${mob1.getMobName()}.`)
  })

  it("generates correct item drop messages", async () => {
    // setup
    mob1.equip(testRunner.createItem().asHelmet().setMaterial(MaterialType.Metal).build())
    const mock = clientServiceMock()
    eventConsumer = new ShockingWeaponEffectEventConsumer(
      new WeaponEffectService(
        eventService,
        locationService,
        mock as any))

    // given
    const event = createDamageEvent(mob1.get(), 1, DamageType.Slash, 1, mob2.get())

    // when
    const room = testRunner.getStartRoom().get()
    await doNTimesOrUntilTruthy(iterations, async () => {
      await eventConsumer.consume(event)
      return room.inventory.items.length > 0
    })

    // then
    const response = mock.getResponse()
    expect(response).toBeDefined()
    expect(response.getMessageToRequestCreator())
      .toBe(`a baseball cap is shocked by a wood chopping axe and falls off ${mob1.getMobName()}.`)
    expect(response.getMessageToTarget())
      .toBe("a baseball cap is shocked by a wood chopping axe and falls off.")
    expect(response.getMessageToRequestCreator())
      .toBe(`a baseball cap is shocked by a wood chopping axe and falls off ${mob1.getMobName()}.`)
  })
})
