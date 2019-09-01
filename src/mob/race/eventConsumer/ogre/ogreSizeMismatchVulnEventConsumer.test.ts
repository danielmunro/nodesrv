import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {createDamageEvent} from "../../../../event/factory/eventFactory"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import {MobEntity} from "../../../entity/mobEntity"
import {DamageType} from "../../../fight/enum/damageType"
import {RaceType} from "../../enum/raceType"
import OgreSizeMismatchVulnEventConsumer from "./ogreSizeMismatchVulnEventConsumer"

let testRunner: TestRunner
let attacker: MobEntity
let defender: MobEntity
let eventConsumer: OgreSizeMismatchVulnEventConsumer

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  attacker = (await testRunner.createMob()).setRace(RaceType.Ogre).get()
  defender = (await testRunner.createMob()).setRace(RaceType.Elf).get()
  eventConsumer = new OgreSizeMismatchVulnEventConsumer()
})

describe("ogre size mismatch vuln event consumer", () => {
  it("decreases the modifier when fighting a differently sized mob", async () => {
    // when
    const eventResponse = await eventConsumer.consume(
      createDamageEvent(defender, 1, DamageType.Slash, 1, attacker))

    // then
    expect(eventResponse.getDamageEvent().modifier).toBeLessThan(1)
  })

  it("unmodified when the size matches", async () => {
    // given
    defender.raceType = RaceType.Ogre

    // when
    const eventResponse = await eventConsumer.consume(
      createDamageEvent(defender, 1, DamageType.Slash, 1, attacker))

    // then
    expect(eventResponse.getDamageEvent().modifier).toBe(1)
  })
})
