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

  it("should build a drink", async () => {
    // given
    const drink = await ItemBuilder.createItemFromImportData({
      pObjFlags: "1 2 milk 0",
      type: ItemType.Drink,
    })

    expect(drink.drink.drinkAmount).toBe(2)
    expect(drink.drink.capacity).toBe(2)
    expect(drink.drink.liquid).toBe("milk")
    expect(drink.drink.foodAmount).toBe(1)
  })

  it("should build a poisoned drink", async () => {
    // given
    const drink = await ItemBuilder.createItemFromImportData({
      pObjFlags: "1 2 milk 1",
      type: ItemType.Drink,
    })

    // expect
    expect(drink.affects.find(affect => affect.affectType === AffectType.Poison)).toBeTruthy()
  })

  it("should build food", async () => {
    // given
    const food = await ItemBuilder.createItemFromImportData({
      pObjFlags: "1 2",
      type: ItemType.Food,
    })

    // expect
    expect(food.food.foodAmount).toBe(1)
    expect(food.food.drinkAmount).toBe(2)
  })

  it("should build poisoned food", async () => {
    // given
    const food = await ItemBuilder.createItemFromImportData({
      pObjFlags: "1 2 0 1",
      type: ItemType.Food,
    })

    // expect
    expect(food.affects.find(affect => affect.affectType === AffectType.Poison)).toBeTruthy()
  })

  it("should build a fountain", async () => {
    // given
    const fountain = await ItemBuilder.createItemFromImportData({
      pObjFlags: "1 2 water 0",
      type: ItemType.Fountain,
    })

    // expect
    expect(fountain.drink.foodAmount).toBe(1)
    expect(fountain.drink.drinkAmount).toBe(2)
    expect(fountain.drink.liquid).toBe("water")
  })

  it("should build a poisoned fountain", async () => {
    // given
    const fountain = await ItemBuilder.createItemFromImportData({
      pObjFlags: "1 2 water 1",
      type: ItemType.Fountain,
    })

    // expect
    expect(fountain.affects.find(affect => affect.affectType === AffectType.Poison)).toBeTruthy()
  })
})
