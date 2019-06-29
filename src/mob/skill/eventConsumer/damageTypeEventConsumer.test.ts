import {createTestAppContainer} from "../../../app/factory/testFactory"
import {createDamageEvent} from "../../../event/factory/eventFactory"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import DamageEvent from "../../event/damageEvent"
import {DamageType} from "../../fight/enum/damageType"
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

describe("bludgeon damage type event consumer", () => {
  it("increases bludgeon bonus with a bashing weapon", async () => {
    // setup
    consumer = new DamageTypeEventConsumer(SkillType.Bludgeon, DamageType.Bash)

    // given
    attacker.withSkill(SkillType.Bludgeon)
    attacker.equip(testRunner.createWeapon().asMace().build())

    // when
    const eventResponse = await consumer.consume(
      createDamageEvent(defender.get(), 1, DamageType.Bash, modifier, attacker.get()))

    // then
    expect((eventResponse.event as DamageEvent).modifier).toBeGreaterThan(modifier)
  })

  it("does not increase bludgeon bonus without the skill", async () => {
    // setup
    consumer = new DamageTypeEventConsumer(SkillType.Bludgeon, DamageType.Bash)

    // given
    attacker.equip(testRunner.createWeapon().asMace().build())

    // when
    const eventResponse = await consumer.consume(
      createDamageEvent(defender.get(), 1, DamageType.Bash, modifier, attacker.get()))

    // then
    expect((eventResponse.event as DamageEvent).modifier).toBe(modifier)
  })

  it("does not increase bludgeon bonus without a bludgeoning weapon", async () => {
    // setup
    consumer = new DamageTypeEventConsumer(SkillType.Bludgeon, DamageType.Bash)

    // given
    attacker.withSkill(SkillType.Bludgeon)
    attacker.equip(testRunner.createWeapon().asAxe().build())

    // when
    const eventResponse = await consumer.consume(
      createDamageEvent(defender.get(), 1, DamageType.Bash, modifier, attacker.get()))

    // then
    expect((eventResponse.event as DamageEvent).modifier).toBe(modifier)
  })
})

describe("cleave damage type event consumer", () => {
  it("increases damage bonus with a slashing weapon", async () => {
    // setup
    consumer = new DamageTypeEventConsumer(SkillType.Cleave, DamageType.Slash)

    // given
    attacker.withSkill(SkillType.Cleave)
    attacker.equip(testRunner.createWeapon().asAxe().build())

    // when
    const eventResponse = await consumer.consume(
      createDamageEvent(defender.get(), 1, DamageType.Slash, modifier, attacker.get()))

    // then
    expect((eventResponse.event as DamageEvent).modifier).toBeGreaterThan(modifier)
  })

  it("does not increase damage bonus without the skill", async () => {
    // setup
    consumer = new DamageTypeEventConsumer(SkillType.Cleave, DamageType.Slash)

    // given
    attacker.equip(testRunner.createWeapon().asAxe().build())

    // when
    const eventResponse = await consumer.consume(
      createDamageEvent(defender.get(), 1, DamageType.Slash, modifier, attacker.get()))

    // then
    expect((eventResponse.event as DamageEvent).modifier).toBe(modifier)
  })

  it("does not increase damage bonus without a slashing weapon", async () => {
    // setup
    consumer = new DamageTypeEventConsumer(SkillType.Cleave, DamageType.Slash)

    // given
    attacker.withSkill(SkillType.Cleave)
    attacker.equip(testRunner.createWeapon().asMace().build())

    // when
    const eventResponse = await consumer.consume(
      createDamageEvent(defender.get(), 1, DamageType.Slash, modifier, attacker.get()))

    // then
    expect((eventResponse.event as DamageEvent).modifier).toBe(modifier)
  })
})

describe("gouge damage type event consumer", () => {
  it("increases damage bonus with a piercing weapon", async () => {
    // setup
    consumer = new DamageTypeEventConsumer(SkillType.Gouge, DamageType.Pierce)

    // given
    attacker.withSkill(SkillType.Gouge)
    attacker.equip(testRunner.createWeapon().asDagger().build())

    // when
    const eventResponse = await consumer.consume(
      createDamageEvent(defender.get(), 1, DamageType.Pierce, modifier, attacker.get()))

    // then
    expect((eventResponse.event as DamageEvent).modifier).toBeGreaterThan(modifier)
  })

  it("does not increase damage bonus without the skill", async () => {
    // setup
    consumer = new DamageTypeEventConsumer(SkillType.Gouge, DamageType.Pierce)

    // given
    attacker.equip(testRunner.createWeapon().asDagger().build())

    // when
    const eventResponse = await consumer.consume(
      createDamageEvent(defender.get(), 1, DamageType.Pierce, modifier, attacker.get()))

    // then
    expect((eventResponse.event as DamageEvent).modifier).toBe(modifier)
  })

  it("does not increase damage bonus without a piercing weapon", async () => {
    // setup
    consumer = new DamageTypeEventConsumer(SkillType.Gouge, DamageType.Pierce)

    // given
    attacker.withSkill(SkillType.Gouge)
    attacker.equip(testRunner.createWeapon().asMace().build())

    // when
    const eventResponse = await consumer.consume(
      createDamageEvent(defender.get(), 1, DamageType.Bash, modifier, attacker.get()))

    // then
    expect((eventResponse.event as DamageEvent).modifier).toBe(modifier)
  })
})
