import { Trigger } from "../../mob/enum/trigger"
import { AffectType } from "../enum/affectType"
import AffectService from "../service/affectService"

describe("modifier table", () => {
  it("should apply appropriate modifiers for poison", () => {
    const test = (trigger: Trigger) => AffectService.applyAffectModifier([AffectType.Poison], trigger, 1)

    expect(test(Trigger.DamageModifier)).toBeLessThan(1)
    expect(test(Trigger.DamageAbsorption)).toBeGreaterThan(1)
    expect(test(Trigger.MovementCost)).toBeGreaterThan(1)
  })

  it("should apply appropriate modifiers for shield", () => {
    expect(AffectService.applyAffectModifier([AffectType.Shield], Trigger.DamageAbsorption, 1)).toBeLessThan(1)
  })
})
