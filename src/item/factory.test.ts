import { DamageType } from "../damage/damageType"
import { Equipment } from "./equipment"
import { newShield, newWeapon } from "./factory"
import { WeaponType } from "./weaponType"

describe("item factories", () => {
  it("should be able to create a weapon", () => {
    const item = newWeapon("a toy axe", "a toy axe", WeaponType.Axe, DamageType.Slash)
    expect(item.equipment).toBe(Equipment.Weapon)
  })

  it("should be able to create a shield", () => {
    const item = newShield("a test shield", "the description for a test shield")
    expect(item.equipment).toBe(Equipment.Shield)
  })
})
