import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {createDamageEvent} from "../../../../event/factory/eventFactory"
import Weapon from "../../../../item/model/weapon"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import {MobEntity} from "../../../entity/mobEntity"
import DamageEvent from "../../../event/damageEvent"
import {DamageType} from "../../../fight/enum/damageType"
import {RaceType} from "../../enum/raceType"
import OgreBashBonus from "./ogreBashBonus"

let testRunner: TestRunner
let attacker: MobEntity
let defender: MobEntity
let weapon: Weapon
let eventConsumer: OgreBashBonus

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  weapon = testRunner.createWeapon().asMace().setDamageType(DamageType.Bash).build() as Weapon
  attacker = testRunner.createMob()
    .setRace(RaceType.Ogre)
    .equip(weapon)
    .get()
  defender = testRunner.createMob().setRace(RaceType.Elf).get()
  eventConsumer = new OgreBashBonus()
})

describe("ogre bash bonus", () => {
  it("increases when wearing a bashing weapon", async () => {
    // when
    const eventResponse = await eventConsumer.consume(
      createDamageEvent(defender, 1, DamageType.Bash, 1, attacker))

    // then
    expect((eventResponse.event as DamageEvent).modifier).toBeGreaterThan(1)
  })

  it("decreases when not bashing", async () => {
    // given
    weapon.damageType = DamageType.Slash

    // when
    const eventResponse = await eventConsumer.consume(
      createDamageEvent(defender, 1, DamageType.Slash, 1, attacker))

    // then
    expect((eventResponse.event as DamageEvent).modifier).toBe(1)
  })
})
