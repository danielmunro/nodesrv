import { DamageType } from "../mob/fight/damageType"
import { Equipment } from "./enum/equipment"
import { WeaponType } from "./enum/weaponType"
import { newWeapon } from "./factory"

describe("item factories", () => {
  it("should be able to create a weapon", () => {
    const item = newWeapon("a toy axe", "a toy axe", WeaponType.Axe, DamageType.Slash)
    expect(item.equipment).toBe(Equipment.Weapon)
  })
})
