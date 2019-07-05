import {createTestAppContainer} from "../../../app/factory/testFactory"
import {createDamageEvent} from "../../../event/factory/eventFactory"
import EventService from "../../../event/service/eventService"
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
import WeaponEffectService from "../../service/weaponEffectService"
import VampiricWeaponEffectEventConsumer from "./vampiricWeaponEffectEventConsumer"

let testRunner: TestRunner
let locationService: LocationService
let eventService: EventService
let eventConsumer: VampiricWeaponEffectEventConsumer
let mob1: MobBuilder
let mob2: MobBuilder
const iterations = 100

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  eventService = app.get<EventService>(Types.EventService)
  locationService = app.get<LocationService>(Types.LocationService)
  eventConsumer = new VampiricWeaponEffectEventConsumer(app.get<WeaponEffectService>(Types.WeaponEffectService))
  mob1 = testRunner.createMob().setRace(RaceType.Halfling)
  mob2 = testRunner.createMob()
    .equip(testRunner.createWeapon()
      .asAxe()
      .addWeaponEffect(WeaponEffect.Vampiric)
      .build())
})

describe("vampiric weapon effect event consumer", () => {
  it("draws life on hit", async () => {
    // given
    mob2.setHp(1)

    // and
    const event = createDamageEvent(mob1.get(), 1, DamageType.Slash, 1, mob2.get())

    // when
    await doNTimes(iterations, () => eventConsumer.consume(event))

    // then
    expect(mob2.getHp()).toBeGreaterThan(1)
  })

  it("generates correct success messages", async () => {
    // setup
    let response: Response
    const mock = jest.fn(() => ({
      sendResponseToRoom: (res: Response) => {
        response = res
      },
    }))
    eventConsumer = new VampiricWeaponEffectEventConsumer(
      new WeaponEffectService(
        eventService,
        locationService,
        mock() as ClientService))

    // given
    const event = createDamageEvent(mob1.get(), 1, DamageType.Slash, 1, mob2.get())

    // when
    await doNTimes(iterations, () => eventConsumer.consume(event))

    // then
    expect(response).toBeDefined()
    expect(response.getMessageToRequestCreator())
      .toBe(`a wood chopping axe draws life from ${mob1.getMobName()}.`)
    expect(response.getMessageToTarget())
      .toBe("a wood chopping axe draws life from you.")
    expect(response.getMessageToRequestCreator())
      .toBe(`a wood chopping axe draws life from ${mob1.getMobName()}.`)
  })
})
