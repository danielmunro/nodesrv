import {createTestAppContainer} from "../../../../../app/factory/testFactory"
import {createDamageEvent} from "../../../../../event/factory/eventFactory"
import TestRunner from "../../../../../support/test/testRunner"
import {Types} from "../../../../../support/types"
import DamageEvent from "../../../../event/damageEvent"
import {DamageType} from "../../../../fight/enum/damageType"
import {Mob} from "../../../../model/mob"
import {RaceType} from "../../../enum/raceType"
import DwarfWaterVuln from "./dwarfWaterVuln"

let testRunner: TestRunner
let attacker: Mob
let defender: Mob
let eventConsumer: DwarfWaterVuln

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  attacker = testRunner.createMob().equip(
    testRunner.createWeapon()
      .asAxe()
      .setDamageType(DamageType.Water)
      .build()).get()
  defender = testRunner.createMob().setRace(RaceType.Dwarf).get()
  eventConsumer = new DwarfWaterVuln()
})

describe("dwarf water vuln", () => {
  it("increases the modifier when water", async () => {
    const eventResponse = await eventConsumer.consume(
      createDamageEvent(defender, 1, DamageType.Water, 1, attacker))

    expect((eventResponse.event as DamageEvent).modifier).toBeGreaterThan(1)
  })
})
