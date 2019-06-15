import {createTestAppContainer} from "../../app/factory/testFactory"
import {createDamageEvent} from "../../event/factory/eventFactory"
import DamageEvent from "../../mob/event/damageEvent"
import {DamageType} from "../../mob/fight/enum/damageType"
import MobBuilder from "../../support/test/mobBuilder"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {SkillType} from "../skillType"
import DamageTypeEventConsumer from "./damageTypeEventConsumer"

let testRunner: TestRunner
let attacker: MobBuilder
let defender: MobBuilder
let consumer: DamageTypeEventConsumer
const modifier = 1

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  attacker = testRunner.createMob()
  defender = testRunner.createMob()
})

describe("damage type event consumer", () => {
  it("increases bludgeon bonus with a bashing weapon", async () => {
    // setup
    consumer = new DamageTypeEventConsumer(SkillType.Bludgeon, DamageType.Bash)

    // given
    attacker.withSkill(SkillType.Bludgeon)
    attacker.equip(testRunner.createWeapon().asMace().build())

    const eventResponse = await consumer.consume(
      createDamageEvent(defender.get(), 1, DamageType.Bash, modifier, attacker.get()))

    expect((eventResponse.event as DamageEvent).modifier).toBeGreaterThan(modifier)
  })

  it("does not increase bludgeon bonus without the skill", async () => {
    // setup
    consumer = new DamageTypeEventConsumer(SkillType.Bludgeon, DamageType.Bash)

    // given
    attacker.equip(testRunner.createWeapon().asMace().build())

    const eventResponse = await consumer.consume(
      createDamageEvent(defender.get(), 1, DamageType.Bash, modifier, attacker.get()))

    expect((eventResponse.event as DamageEvent).modifier).toBe(modifier)
  })

  it("does not increase bludgeon bonus without a bludgeoning weapon", async () => {
    // setup
    consumer = new DamageTypeEventConsumer(SkillType.Bludgeon, DamageType.Bash)

    // given
    attacker.withSkill(SkillType.Bludgeon)
    attacker.equip(testRunner.createWeapon().asAxe().build())

    const eventResponse = await consumer.consume(
      createDamageEvent(defender.get(), 1, DamageType.Bash, modifier, attacker.get()))

    expect((eventResponse.event as DamageEvent).modifier).toBe(modifier)
  })
})
