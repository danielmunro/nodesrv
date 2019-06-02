import {createTestAppContainer} from "../../../../../app/factory/testFactory"
import {createDamageEvent} from "../../../../../event/factory/eventFactory"
import TestRunner from "../../../../../support/test/testRunner"
import {Types} from "../../../../../support/types"
import DamageEvent from "../../../../event/damageEvent"
import {DamageType} from "../../../../fight/enum/damageType"
import {Mob} from "../../../../model/mob"
import {RaceType} from "../../../enum/raceType"
import OgreSizeMismatchVuln from "./ogreSizeMismatchVuln"

let testRunner: TestRunner
let attacker: Mob
let defender: Mob
let eventConsumer: OgreSizeMismatchVuln

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  attacker = testRunner.createMob().setRace(RaceType.Ogre).get()
  defender = testRunner.createMob().setRace(RaceType.Elf).get()
  eventConsumer = new OgreSizeMismatchVuln()
})

describe("ogre size mismatch vuln", () => {
  it("decreases the modifier when fighting a differently sized mob", async () => {
    // when
    const eventResponse = await eventConsumer.consume(
      createDamageEvent(defender, 1, DamageType.Slash, 1, attacker))

    // then
    expect((eventResponse.event as DamageEvent).modifier).toBeLessThan(1)
  })

  it("unmodified when the size matches", async () => {
    // given
    defender.raceType = RaceType.Ogre

    // when
    const eventResponse = await eventConsumer.consume(
      createDamageEvent(defender, 1, DamageType.Slash, 1, attacker))

    // then
    expect((eventResponse.event as DamageEvent).modifier).toBe(1)
  })
})
