import { DamageType } from "../damage/damageType"
import { Equipment } from "./enum/equipment"
import { newWeapon } from "./factory"
import { WeaponType } from "./enum/weaponType"

describe("item factories", () => {
  it("should be able to create a weapon", () => {
    const item = newWeapon("a toy axe", "a toy axe", WeaponType.Axe, DamageType.Slash)
    expect(item.equipment).toBe(Equipment.Weapon)
  })
})
