import { Disposition } from "../../mob/enum/disposition"
import { Attack, AttackResult } from "../../mob/fight/attack"
import {getConnection, initializeConnection} from "../../support/db/connection"
import { getTestClient } from "../../test/client"
import { getTestMob } from "../../test/mob"
import TestBuilder from "../../test/testBuilder"
import { attackMessage, createClientMobMap, FightRounds, getHealthIndicator } from "./fightRounds"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

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
    mob1.vitals.hp -= newDamageAmount
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
    const clients = [
      await getTestClient(),
      await getTestClient(),
      await getTestClient(),
    ]
    const map = createClientMobMap(clients)
    const keys = Object.keys(map)
    expect(keys.length).toBe(3)
    keys.forEach((key, i) => expect(map[key]).toBe(clients[i]))
  })

  it("should filter complete fights", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()
    mobBuilder.mob.vitals.hp = 0
    await testBuilder.fight()
    const service = await testBuilder.getService()
    const mobService = service.mobService

    // when
    const fight = mobService.findFight(f => f.isParticipant(mobBuilder.mob))

    // then
    expect(fight.isInProgress()).toBe(true)

    // when
    await fight.round()

    // then
    mobService.filterCompleteFights()
    expect(fight.isInProgress()).toBe(false)
    expect(mobService.findFight(f => f.isParticipant(mobBuilder.mob))).toBeUndefined()
  })

  it("should filter out fight rounds that are complete", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const client = await testBuilder.withClient()
    await testBuilder.fight()
    const service = await testBuilder.getService()
    const fightRounds = new FightRounds(service.mobService)

    // when
    await fightRounds.notify([client])

    // then
    const fight = service.mobService.findFight(f => f.isParticipant(client.player.sessionMob))
    expect(fight.isInProgress()).toBe(true)

    // and when
    client.player.sessionMob.vitals.hp = -1
    client.player.sessionMob.disposition = Disposition.Dead
    await fightRounds.notify([client])

    // then
    const fight2 = service.mobService.findFight(f => f.isParticipant(client.player.sessionMob))
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
