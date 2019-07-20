import {createTestAppContainer} from "../../app/factory/testFactory"
import { Disposition } from "../../mob/enum/disposition"
import { Attack} from "../../mob/fight/attack"
import {AttackResult} from "../../mob/fight/enum/attackResult"
import MobService from "../../mob/service/mobService"
import { getTestMob } from "../../support/test/mob"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import { attackMessage, createClientMobMap, FightRounds, getHealthIndicator } from "./fightRounds"

describe("fight rounds", () => {
  it("should generate accurate attacks messages", () => {
    // setup
    const mob1 = getTestMob("mob1")
    const mob2 = getTestMob("mob2")

    // given
    const damageAmount = 1

    // when
    const attack1 = new Attack(mob1, mob2, AttackResult.Hit, damageAmount)

    // then
    expect(attackMessage(attack1, mob1)).toEqual("Your clumsy punch gives mob2 a bruise.")
    expect(attackMessage(attack1, mob2)).toEqual("mob1's clumsy punch gives you a bruise.")

    // and
    const newDamageAmount = 100

    // when
    mob1.hp -= newDamageAmount
    const attack2 = new Attack(mob2, mob1, AttackResult.Hit, newDamageAmount)

    // then
    expect(attackMessage(attack2, mob1)).toContain("You have DIED")
    expect(attackMessage(attack2, mob2)).toContain("mob1 has DIED")

    // when
    const unspeakableDamageAmount = 1000
    const attack3 = new Attack(mob2, mob1, AttackResult.Hit, unspeakableDamageAmount)

    // then
    expect(attackMessage(attack3, mob1)).toContain("UNSPEAKABLE")
  })

  it("should be able to create a map between clients and session mobs", async () => {
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    const clients = [
      await testRunner.createLoggedInClient(),
      await testRunner.createLoggedInClient(),
      await testRunner.createLoggedInClient(),
    ]
    const map = createClientMobMap(clients)
    const keys = Object.keys(map)
    expect(keys.length).toBe(3)
    keys.forEach((key, i) => expect(map[key]).toBe(clients[i]))
  })

  it("should filter complete fights", async () => {
    // setup
    const app = await createTestAppContainer()
    const testRunner = app.get<TestRunner>(Types.TestRunner)
    const mobBuilder = (await testRunner.createMob()).setHp(0)
    await testRunner.fight()
    const mobService = app.get<MobService>(Types.MobService)

    // when
    const fight = mobService.findFightForMob(mobBuilder.get()).get()

    // then
    expect(fight.isInProgress()).toBe(true)

    // when
    await fight.round()

    // then
    mobService.filterCompleteFights()
    expect(fight.isInProgress()).toBe(false)
    expect(mobService.findFightForMob(mobBuilder.get()).get()).toBeUndefined()
  })

  it("should filter out fight rounds that are complete", async () => {
    // setup
    const app = await createTestAppContainer()
    const testRunner = app.get<TestRunner>(Types.TestRunner)
    const mobBuilder = await testRunner.createMob()
    await testRunner.fight()
    const mobService = app.get<MobService>(Types.MobService)
    const fightRounds = new FightRounds(mobService)

    // when
    await fightRounds.notify([])

    // then
    const fight = mobService.findFightForMob(mobBuilder.get()).get()
    expect(fight.isInProgress()).toBe(true)

    // and when
    mobBuilder.setHp(-1)
    mobBuilder.withDisposition(Disposition.Dead)
    await fightRounds.notify([])

    // then
    const fight2 = mobService.findFightForMob(mobBuilder.get()).get()
    expect(fight2).toBeUndefined()
  })
})

describe("health indicator", () => {
  it("should be able to provide a string description for any level of health", () => {
    let i = 100
    while (i > -1) {
      const indicator = getHealthIndicator(i / 100)
      expect(indicator.length).toBeGreaterThan(0)
      i--
    }
  })
})
