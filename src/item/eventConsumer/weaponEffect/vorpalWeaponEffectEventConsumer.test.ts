import {createTestAppContainer} from "../../../app/factory/testFactory"
import {EventType} from "../../../event/enum/eventType"
import {createFightEvent} from "../../../event/factory/eventFactory"
import FightEvent from "../../../mob/fight/event/fightEvent"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {WeaponEffect} from "../../enum/weaponEffect"
import VorpalWeaponEffectEventConsumer from "./vorpalWeaponEffectEventConsumer"

let testRunner: TestRunner
let mob: MobBuilder
let eventConsumer: VorpalWeaponEffectEventConsumer

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mob = (await testRunner.createMob()).equip(
    testRunner.createWeapon().asAxe().addWeaponEffect(WeaponEffect.Vorpal).build())
  eventConsumer = new VorpalWeaponEffectEventConsumer()
})

describe("vorpal weapon effect event consumer", () => {
  it("adds an attack", async () => {
    const target = (await testRunner.createMob()).get()

    // when
    const eventResponse = await eventConsumer.consume(
      createFightEvent(EventType.AttackRound, mob.get(), await testRunner.fight(target)))

    // then
    expect((eventResponse.event as FightEvent).attacks).toHaveLength(1)
  })
})
