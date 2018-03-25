import { Equipment } from "./equipment"
import { newShield, newWeapon } from "./factory"

describe("item factories", () => {
  it("should be able to create a weapon", () => {
    const item = newWeapon("a test weapon", "the description for a test weapon")
    expect(item.equipment).toBe(Equipment.Weapon)
  })

  it("should be able to create a shield", () => {
    const item = newShield("a test shield", "the description for a test shield")
    expect(item.equipment).toBe(Equipment.Shield)
  })
})
