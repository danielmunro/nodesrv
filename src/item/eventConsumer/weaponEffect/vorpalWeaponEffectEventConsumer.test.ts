import {createTestAppContainer} from "../../../app/factory/testFactory"
import {EventType} from "../../../event/enum/eventType"
import {createFightEvent} from "../../../event/factory/eventFactory"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {WeaponEffect} from "../../enum/weaponEffect"
import VorpalWeaponEffectEventConsumer from "./vorpalWeaponEffectEventConsumer"

let testRunner: TestRunner
let mob1: MobBuilder
let mob2: MobBuilder
let eventConsumer: VorpalWeaponEffectEventConsumer

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mob1 = testRunner.createMob()
  mob2 = testRunner.createMob().equip(
    testRunner.createWeapon().asAxe().addWeaponEffect(WeaponEffect.Vorpal).build())
  eventConsumer = new VorpalWeaponEffectEventConsumer()
})

describe("vorpal weapon effect event consumer", () => {
  it("adds an attack", async () => {
    // when
    const eventResponse = await eventConsumer.consume(
      createFightEvent(EventType.AttackRound, mob2.get(), testRunner.fight(mob2.get())))

    // then
    expect(eventResponse.event.attacks).toHaveLength(1)
  })
})
