import {AffectType} from "../../../affect/enum/affectType"
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
import PoisonWeaponEffectEventConsumer from "./poisonWeaponEffectEventConsumer"

let testRunner: TestRunner
let eventService: EventService
let locationService: LocationService
let mob1: MobBuilder
let mob2: MobBuilder
let eventConsumer: PoisonWeaponEffectEventConsumer
const iterations = 100

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  mob1 = await testRunner.createMob()
  mob2 = (await testRunner.createMob()).equip(
    testRunner.createWeapon().asAxe().addWeaponEffect(WeaponEffect.Poison).build())
  eventConsumer = new PoisonWeaponEffectEventConsumer(app.get<WeaponEffectService>(Types.WeaponEffectService))
  eventService = app.get<EventService>(Types.EventService)
  locationService = app.get<LocationService>(Types.LocationService)
})

describe("poison weapon effect event consumer", () => {
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
    eventConsumer = new PoisonWeaponEffectEventConsumer(
      new WeaponEffectService(
        eventService,
        locationService,
        mock as any))

    // given
    const event = createDamageEvent(mob1.get(), 1, DamageType.Slash, 1, mob2.get())

    // when
    await eventConsumer.consume(event)

    // then
    const response = mock.getFirstResponse()
    expect(response).toBeDefined()
    expect(response.getMessageToRequestCreator())
      .toBe(`${mob1.getMobName()} is hit with poison from a wood chopping axe.`)
    expect(response.getMessageToTarget())
      .toBe("you are hit with poison from a wood chopping axe.")
    expect(response.getMessageToRequestCreator())
      .toBe(`${mob1.getMobName()} is hit with poison from a wood chopping axe.`)
  })

  it("generates correct poisoning messages", async () => {
    // setup
    mob1.equip(testRunner.createItem().asHelmet().setMaterial(MaterialType.Metal).build())
    const mock = clientServiceMock()
    eventConsumer = new PoisonWeaponEffectEventConsumer(
      new WeaponEffectService(
        eventService,
        locationService,
        mock as any))

    // given
    const event = createDamageEvent(mob1.get(), 1, DamageType.Slash, 1, mob2.get())

    // when
    await doNTimesOrUntilTruthy(iterations, async () => {
      await eventConsumer.consume(event)
      return mob1.hasAffect(AffectType.Poison)
    })

    // then
    const response = mock.getResponse()
    expect(response).toBeDefined()
    expect(response.getMessageToRequestCreator())
      .toBe(`${mob1.getMobName()} turns green from a wood chopping axe's poison.`)
    expect(response.getMessageToTarget())
      .toBe("you turn green from a wood chopping axe's poison.")
    expect(response.getMessageToRequestCreator())
      .toBe(`${mob1.getMobName()} turns green from a wood chopping axe's poison.`)
  })
})
