import { newMobLocation } from "../../mob/factory"
import { Attack, AttackResult } from "../../mob/fight/attack"
import { addFight, Fight, filterCompleteFights, getFights } from "../../mob/fight/fight"
import LocationService from "../../mob/locationService"
import { getTestClient } from "../../test/client"
import { getTestMob } from "../../test/mob"
import { getTestRoom } from "../../test/room"
import TestBuilder from "../../test/testBuilder"
import { attackMessage, createClientMobMap, FightRounds, getHealthIndicator } from "./fightRounds"
import Death from "../../mob/fight/death"

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
    expect(attackMessage(attack1, mob1)).toEqual("Your clumsy hit gives mob2 a bruise.")
    expect(attackMessage(attack1, mob2)).toEqual("mob1's clumsy hit gives you a bruise.")

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
    // Setup
    const mob = getTestMob()
    const room = getTestRoom()
    mob.vitals.hp = 0
    const fight = new Fight(getTestMob(), mob, room)
    addFight(fight)
    expect(getFights().length).toBe(1)
    expect(fight.isInProgress()).toBe(true)

    // When
    await fight.round()
    filterCompleteFights()

    // Then
    expect(fight.isInProgress()).toBe(false)
    expect(getFights().length).toBe(0)
  })

  it("should filter out fight rounds that are complete", async () => {
    // Setup
    const client = await getTestClient()
    const opponent = getTestMob()
    const room = getTestRoom()
    const fight = new Fight(opponent, client.player.sessionMob, room)
    addFight(fight)
    const fightRounds = new FightRounds(new LocationService([
      newMobLocation(client.getSessionMob(), room),
      newMobLocation(opponent, room),
    ]))

    // When
    await fightRounds.notify([client])

    // Then
    expect(getFights().length).toBe(1)
    expect(fight.isInProgress()).toBe(true)

    // When
    client.player.sessionMob.vitals.hp = -1
    await fightRounds.notify([client])

    // Then
    expect(getFights().length).toBe(0)
    expect(fight.isInProgress()).toBe(false)
  })

  it("should transfer all items from the inventory and equipment to the corpse", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const mob = playerBuilder.player.sessionMob
    playerBuilder.equip().withHelmetEq()
    playerBuilder.withAxeEq()
    playerBuilder.withFood()

    // given
    const death = new Death(mob, testBuilder.room)

    // when
    const corpse = death.createCorpse()

    // then
    expect(corpse.container.inventory.items.length).toBe(3)
    expect(mob.inventory.items.length).toBe(0)
    expect(mob.equipped.inventory.items.length).toBe(0)
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
