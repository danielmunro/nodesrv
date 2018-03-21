import { Attack, AttackResult } from "../../mob/attack"
import { getTestMob } from "../../test/mob"
import { attackMessage, getHealthIndicator } from "./fightRounds"

describe("fight rounds", () => {
  it("should generate accurate attack messages", () => {
    const mob1 = getTestMob("mob1")
    const mob2 = getTestMob("mob2")
    mob2.vitals.hp -= 1
    const attack1 = new Attack(mob1, mob2, AttackResult.Hit, 1)
    expect(attackMessage(attack1, mob1)).toContain("You hit mob2")
    expect(attackMessage(attack1, mob2)).toContain("mob1 hits you")

    mob1.vitals.hp -= 100
    const attack2 = new Attack(mob2, mob1, AttackResult.Hit, 100)
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
