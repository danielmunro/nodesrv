import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {createDamageEvent} from "../../../../event/factory/eventFactory"
import {ItemEntity} from "../../../../item/entity/itemEntity"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import {MobEntity} from "../../../entity/mobEntity"
import {DamageType} from "../../../fight/enum/damageType"
import {RaceType} from "../../enum/raceType"
import OgreBashBonusEventConsumer from "./ogreBashBonusEventConsumer"

let testRunner: TestRunner
let attacker: MobEntity
let defender: MobEntity
let weapon: ItemEntity
let eventConsumer: OgreBashBonusEventConsumer

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  weapon = testRunner.createWeapon().asMace().setDamageType(DamageType.Bash).build()
  attacker = (await testRunner.createMob())
    .setRace(RaceType.Ogre)
    .equip(weapon)
    .get()
  defender = (await testRunner.createMob()).setRace(RaceType.Elf).get()
  eventConsumer = new OgreBashBonusEventConsumer()
})

describe("ogre bash bonus event consumer", () => {
  it("increases when wearing a bashing weapon", async () => {
    // when
    const eventResponse = await eventConsumer.consume(
      createDamageEvent(defender, 1, DamageType.Bash, 1, attacker))

    // then
    expect(eventResponse.getDamageEvent().modifier).toBeGreaterThan(1)
  })

  it("decreases when not bashing", async () => {
    // given
    weapon.damageType = DamageType.Slash

    // when
    const eventResponse = await eventConsumer.consume(
      createDamageEvent(defender, 1, DamageType.Slash, 1, attacker))

    // then
    expect(eventResponse.getDamageEvent().modifier).toBe(1)
  })
})
