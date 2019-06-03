import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {createDamageEvent} from "../../../../event/factory/eventFactory"
import {MaterialType} from "../../../../item/enum/materialType"
import Weapon from "../../../../item/model/weapon"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import DamageEvent from "../../../event/damageEvent"
import {DamageType} from "../../../fight/enum/damageType"
import {Mob} from "../../../model/mob"
import {RaceType} from "../../enum/raceType"
import ElfIronVuln from "./elfIronVuln"

let testRunner: TestRunner
let attacker: Mob
let defender: Mob
let eventConsumer: ElfIronVuln
let weapon: Weapon

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  weapon = testRunner.createWeapon()
    .asAxe()
    .setMaterial(MaterialType.Iron)
    .build() as Weapon
  attacker = testRunner.createMob().equip(weapon).get()
  defender = testRunner.createMob().setRace(RaceType.Elf).get()
  eventConsumer = new ElfIronVuln()
})

describe("elf iron vuln", () => {
  it("increases the modifier when using an iron weapon", async () => {
    // when
    const eventResponse = await eventConsumer.consume(
      createDamageEvent(defender, 1, DamageType.Slash, 1, attacker))

    // then
    expect((eventResponse.event as DamageEvent).modifier).toBeGreaterThan(1)
  })

  it("is unmodified when not using iron", async () => {
    // given
    weapon.material = MaterialType.Aluminum

    // when
    const eventResponse = await eventConsumer.consume(
      createDamageEvent(defender, 1, DamageType.Slash, 1, attacker))

    // then
    expect((eventResponse.event as DamageEvent).modifier).toBe(1)
  })
})
