import {createTestAppContainer} from "../../../app/factory/testFactory"
import EventResponse from "../../../event/eventResponse"
import {createDamageEvent} from "../../../event/factory/eventFactory"
import EventService from "../../../event/service/eventService"
import DamageEvent from "../../../mob/event/damageEvent"
import {DamageType} from "../../../mob/fight/enum/damageType"
import {RaceType} from "../../../mob/race/enum/raceType"
import LocationService from "../../../mob/service/locationService"
import doNTimes from "../../../support/functional/times"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {WeaponEffect} from "../../enum/weaponEffect"
import WeaponEffectService from "../../service/weaponEffectService"
import clientServiceMock from "./clientServiceMock"
import FrostWeaponEffectEventConsumer from "./frostWeaponEffectEventConsumer"

let testRunner: TestRunner
let locationService: LocationService
let eventService: EventService
let eventConsumer: FrostWeaponEffectEventConsumer
let mob1: MobBuilder
let mob2: MobBuilder
const iterations = 100

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  eventService = app.get<EventService>(Types.EventService)
  locationService = app.get<LocationService>(Types.LocationService)
  eventConsumer = new FrostWeaponEffectEventConsumer(app.get<WeaponEffectService>(Types.WeaponEffectService))
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
    expect(eventResponses.find(eventResponse =>
      (eventResponse.event as DamageEvent).modifier > 1)).toBeDefined()
  })

  it("generates correct success messages", async () => {
    // setup
    const mock = clientServiceMock()
    eventConsumer = new FrostWeaponEffectEventConsumer(
      new WeaponEffectService(
        eventService,
        locationService,
        mock as any))

    // given
    const event = createDamageEvent(mob1.get(), 1, DamageType.Slash, 1, mob2.get())

    // when
    await doNTimes(iterations, () => eventConsumer.consume(event))

    // then
    const response = mock.getResponse()
    expect(response).toBeDefined()
    expect(response.getMessageToRequestCreator()).toBe(`a wood chopping axe freezes ${mob1.getMobName()}!`)
    expect(response.getMessageToTarget()).toBe("a wood chopping axe freezes you!")
    expect(response.getMessageToRequestCreator()).toBe(`a wood chopping axe freezes ${mob1.getMobName()}!`)
  })
})
