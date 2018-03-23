import { Attack, AttackResult } from "../../mob/fight/attack"
import { getTestMob } from "../../test/mob"
import { attackMessage, getHealthIndicator } from "./fightRounds"

describe("fight rounds", () => {
  it("should generate accurate attack messages", () => {
    const mob1 = getTestMob("mob1")
    const mob2 = getTestMob("mob2")
    const damageAmount = 1
    mob2.vitals.hp -= damageAmount
    const attack1 = new Attack(mob1, mob2, AttackResult.Hit, damageAmount)
    expect(attackMessage(attack1, mob1)).toContain("You hit mob2")
    expect(attackMessage(attack1, mob2)).toContain("mob1 hits you")

    const newDamageAmount = 100
    mob1.vitals.hp -= newDamageAmount
    const attack2 = new Attack(mob2, mob1, AttackResult.Hit, newDamageAmount)
    expect(attackMessage(attack2, mob1)).toContain("You have DIED")
    expect(attackMessage(attack2, mob2)).toContain("mob1 has DIED")
  })
})

describe("health indicator", () => {
  it("should be able to provide a string description for any level of health", () => {
    let i = 100
    while (i > 0) {
      const indicator = getHealthIndicator(i / 100)
      expect(indicator.length).toBeGreaterThan(0)
      i--
    }
  })
})
