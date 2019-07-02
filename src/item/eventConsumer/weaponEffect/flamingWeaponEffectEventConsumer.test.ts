import {createTestAppContainer} from "../../../app/factory/testFactory"
import {createDamageEvent} from "../../../event/factory/eventFactory"
import EventService from "../../../event/service/eventService"
import {DamageType} from "../../../mob/fight/enum/damageType"
import LocationService from "../../../mob/service/locationService"
import ClientService from "../../../server/service/clientService"
import doNTimes from "../../../support/functional/times"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {MaterialType} from "../../enum/materialType"
import {WeaponEffect} from "../../enum/weaponEffect"
import FlamingWeaponEffectEventConsumer from "./flamingWeaponEffectEventConsumer"

let testRunner: TestRunner
let mob1: MobBuilder
let mob2: MobBuilder
let eventConsumer: FlamingWeaponEffectEventConsumer

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  mob1 = testRunner.createMob()
  mob2 = testRunner.createMob()
    .equip(testRunner.createWeapon()
      .asAxe()
      .addWeaponEffect(WeaponEffect.Flaming)
      .build())
  eventConsumer = new FlamingWeaponEffectEventConsumer(
    app.get<EventService>(Types.EventService),
    app.get<LocationService>(Types.LocationService),
    app.get<ClientService>(Types.ClientService))
})

describe("flaming weapon effect event consumer", () => {
  it("non wood equipment should not burn", async () => {
    // given
    mob1.equip(testRunner.createItem()
      .asShield()
      .setMaterial(MaterialType.Iron)
      .build())

    // when
    await doNTimes(100, () =>
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
    await doNTimes(100, () =>
      eventConsumer.consume(createDamageEvent(
        mob1.get(),
        1,
        DamageType.Slash,
        1,
        mob2.get())))

    // then
    expect(mob1.get().equipped.items).toHaveLength(0)
  })
})
