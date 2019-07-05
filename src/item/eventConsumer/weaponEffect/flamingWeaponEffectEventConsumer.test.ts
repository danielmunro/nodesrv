import {AffectType} from "../../../affect/enum/affectType"
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
import {MaterialType} from "../../enum/materialType"
import {WeaponEffect} from "../../enum/weaponEffect"
import WeaponEffectService from "../../service/weaponEffectService"
import FlamingWeaponEffectEventConsumer from "./flamingWeaponEffectEventConsumer"

let testRunner: TestRunner
let eventService: EventService
let locationService: LocationService
let mob1: MobBuilder
let mob2: MobBuilder
let eventConsumer: FlamingWeaponEffectEventConsumer
const iterations = 100

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  eventService = app.get<EventService>(Types.EventService)
  locationService = app.get<LocationService>(Types.LocationService)
  mob1 = testRunner.createMob().setName("foo")
  mob2 = testRunner.createMob().setName("bar")
    .equip(testRunner.createWeapon()
      .asAxe()
      .addWeaponEffect(WeaponEffect.Flaming)
      .build())
  eventConsumer = new FlamingWeaponEffectEventConsumer(
    new WeaponEffectService(
      eventService, locationService, app.get<ClientService>(Types.ClientService)))
})

describe("flaming weapon effect event consumer", () => {
  it("non wood equipment should not burn", async () => {
    // given
    mob1.equip(testRunner.createItem()
      .asShield()
      .setMaterial(MaterialType.Iron)
      .build())

    // when
    await doNTimes(iterations, () =>
      eventConsumer.consume(createDamageEvent(
        mob1.get(),
        1,
        DamageType.Slash,
        1,
        mob2.get())))

    // then
    expect(mob1.get().equipped.items).toHaveLength(1)
  })

  it("should result in the burning of wooden equipment", async () => {
    // given
    mob1.equip(testRunner.createItem()
      .asShield()
      .setMaterial(MaterialType.Wood)
      .build())

    // when
    await doNTimes(iterations, () =>
      eventConsumer.consume(createDamageEvent(
        mob1.get(),
        1,
        DamageType.Slash,
        1,
        mob2.get())))

    // then
    expect(mob1.get().equipped.items).toHaveLength(0)
  })

  it("does not burn wood equipment if the eq has a fireproof affect", async () => {
    // given
    mob1.equip(testRunner.createItem()
      .asShield()
      .setMaterial(MaterialType.Wood)
      .addAffect(AffectType.Fireproof)
      .build())

    // when
    await doNTimes(iterations, () =>
      eventConsumer.consume(createDamageEvent(
        mob1.get(),
        1,
        DamageType.Slash,
        1,
        mob2.get())))

    // then
    expect(mob1.get().equipped.items).toHaveLength(1)
  })

  it("drops contents when a containers burns", async () => {
    // given
    mob1.equip(testRunner.createItem()
      .asSatchel()
      .setMaterial(MaterialType.Leather)
      .addItemToContainerInventory(testRunner.createItem().asKey().build())
      .addItemToContainerInventory(testRunner.createItem().asHelmet().build())
      .build())

    // when
    await doNTimes(iterations, () =>
      eventConsumer.consume(createDamageEvent(
        mob1.get(),
        1,
        DamageType.Slash,
        1,
        mob2.get())))

    // then
    expect(mob1.get().equipped.items).toHaveLength(0)
    expect(testRunner.getStartRoom().getItemCount()).toBe(2)
  })

  it("generates accurate item burning messages", async () => {
    // setup
    let response: Response
    const mock = jest.fn(() => ({
      sendResponseToRoom: (res: Response) => {
        response = res
      },
    }))
    eventConsumer = new FlamingWeaponEffectEventConsumer(
      new WeaponEffectService(eventService, locationService, mock() as ClientService))

    // given
    mob1.equip(testRunner.createItem()
      .asShield()
      .setMaterial(MaterialType.Wood)
      .build())

    // when
    await doNTimes(iterations, () =>
      eventConsumer.consume(createDamageEvent(
        mob1.get(),
        1,
        DamageType.Slash,
        1,
        mob2.get())))

    // then
    expect(response).toBeDefined()
    expect(response.getMessageToRequestCreator())
      .toBe(`a wooden practice shield catches fire and burns up as it falls off ${mob1.getMobName()}.`)
    expect(response.getMessageToTarget())
      .toBe("a wooden practice shield catches fire and burns up as it falls off you.")
    expect(response.getMessageToObservers())
      .toBe(`a wooden practice shield catches fire and burns up as it falls off ${mob1.getMobName()}.`)
  })

  it("generates accurate race burning messages", async () => {
    // setup
    let response: Response
    const mock = jest.fn(() => ({
      sendResponseToRoom: (res: Response) => {
        response = res
      },
    }))
    eventConsumer = new FlamingWeaponEffectEventConsumer(
      new WeaponEffectService(eventService, locationService, mock() as ClientService))

    // given
    mob1.setRace(RaceType.Halfling)

    // when
    await doNTimes(iterations, () =>
      eventConsumer.consume(createDamageEvent(
        mob1.get(),
        1,
        DamageType.Slash,
        1,
        mob2.get())))

    // then
    expect(response).toBeDefined()
    expect(response.getMessageToRequestCreator())
      .toBe(`a wood chopping axe sears ${mob1.getMobName()}'s flesh as they scream in pain.`)
    expect(response.getMessageToTarget())
      .toBe("a wood chopping axe sears your flesh as you scream in pain.")
    expect(response.getMessageToObservers())
      .toBe(`a wood chopping axe sears ${mob1.getMobName()}'s flesh as they scream in pain.`)
  })
})
