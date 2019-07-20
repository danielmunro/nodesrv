import {createTestAppContainer} from "../../../app/factory/testFactory"
import {EventType} from "../../../event/enum/eventType"
import {createFightEvent} from "../../../event/factory/eventFactory"
import FightEvent from "../../../mob/fight/event/fightEvent"
import {Fight} from "../../../mob/fight/fight"
import {SpecializationType} from "../../../mob/specialization/enum/specializationType"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {WeaponEffect} from "../../enum/weaponEffect"
import FavoredWeaponEffectEventConsumer from "./favoredWeaponEffectEventConsumer"

let testRunner: TestRunner
let mob2: MobBuilder
let eventConsumer: FavoredWeaponEffectEventConsumer
let fight: Fight

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  await testRunner.createMob()
  mob2 = (await testRunner.createMob())
    .setSpecialization(SpecializationType.Cleric)
    .equip(
      testRunner.createWeapon().asAxe().addWeaponEffect(WeaponEffect.Favored).build())
  eventConsumer = new FavoredWeaponEffectEventConsumer()
  fight = await testRunner.fight(mob2.get())
})

describe("favored weapon effect event consumer", () => {
  it("provides an extra attack to clerics", async () => {
    // given
    const event = createFightEvent(EventType.AttackRound, mob2.get(), fight)

    // when
    const eventResponse = await eventConsumer.consume(event)

    // then
    expect((eventResponse.event as FightEvent).attacks).toHaveLength(1)
  })

  it("does not provide an extra attack if not a cleric", async () => {
    // given
    mob2.setSpecialization(SpecializationType.Mage)
    const event = createFightEvent(EventType.AttackRound, mob2.get(), fight)

    // when
    const eventResponse = await eventConsumer.consume(event)

    // then
    expect((eventResponse.event as FightEvent).attacks).toHaveLength(0)
  })
})
