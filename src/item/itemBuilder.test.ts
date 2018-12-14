import {AffectType} from "../affect/affectType"
import {DamageType} from "../damage/damageType"
import {ItemType} from "../import/enum/itemType"
import {Equipment} from "./equipment"
import ItemBuilder from "./itemBuilder"
import Weapon from "./model/weapon"
import {WeaponType} from "./weaponType"

describe("itemBuilder", () => {
  it("should build a weapon", async () => {
    // given
    const weapon = await ItemBuilder.createItemFromImportData({
      pObjFlags: "sword (null) slash",
      type: ItemType.Weapon,
    }) as Weapon

    // expect
    expect(weapon).toBeInstanceOf(Weapon)
    expect(weapon.damageType).toBe(DamageType.Slash)
    expect(weapon.weaponType).toBe(WeaponType.Sword)
  })

  it("should build armor", async () => {
    // given
    const armor = await ItemBuilder.createItemFromImportData({
      pObjFlags: "head",
      type: ItemType.Armor,
    })

    // expect
    expect(armor.equipment).toBe(Equipment.Head)

    // given
    const clothing = await ItemBuilder.createItemFromImportData({
      pObjFlags: "arms",
      type: ItemType.Clothing,
    })

    // expect
    expect(clothing.equipment).toBe(Equipment.Arms)
  })

  it("should build a container", async () => {
    // given
    const item = await ItemBuilder.createItemFromImportData({
      pObjFlags: "10 AB water 1",
      type: ItemType.Container,
    })

    // expect
    expect(item.container.weightCapacity).toBe(10)
    expect(item.container.liquid).toBe("water")
    expect(item.container.maxWeightForItem).toBe(1)
    expect(item.affects.some(affect => affect.affectType === AffectType.Glow)).toBeTruthy()
    expect(item.affects.some(affect => affect.affectType === AffectType.Hum)).toBeTruthy()
    expect(item.affects).toHaveLength(2)
  })
})
