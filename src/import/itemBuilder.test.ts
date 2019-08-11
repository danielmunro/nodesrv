import {AffectType} from "../affect/enum/affectType"
import ForgeEntity from "../item/entity/forgeEntity"
import {ItemEntity} from "../item/entity/itemEntity"
import {Equipment} from "../item/enum/equipment"
import {ItemType} from "../item/enum/itemType"
import {Liquid} from "../item/enum/liquid"
import {WeaponType} from "../item/enum/weaponType"
import {DamageType} from "../mob/fight/enum/damageType"
import {SpellType} from "../mob/spell/spellType"
import { ItemType as ImportItemType } from "./enum/itemType"
import ItemBuilder from "./itemBuilder"

const itemBuilder = ItemBuilder.new()

/* tslint:disable:no-big-function */
describe("itemBuilder", () => {
  it("should build a weapon", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "sword (null) 0 slash",
      type: ImportItemType.Weapon,
    })

    // expect
    expect(item).toBeInstanceOf(ItemEntity)
    expect(item.damageType).toBe(DamageType.Slash)
    expect(item.weaponType).toBe(WeaponType.Sword)
  })

  it("should build a wand", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "4 10 10 'magic missile' 0",
      type: ImportItemType.Wand,
    })

    // expect
    expect(item).toBeInstanceOf(ItemEntity)
    expect(item.damageType).toBe(DamageType.Magic)
    expect(item.weaponType).toBe(WeaponType.Wand)
    expect(item.itemType).toBe(ItemType.Equipment)
    expect(item.equipment).toBe(Equipment.Weapon)
    expect(item.currentCharges).toBe(10)
    expect(item.maxCharges).toBe(10)
    expect(item.castLevel).toBe(4)
    expect(item.spellType).toBe(SpellType.MagicMissile)
  })

  it("should build a staff", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "4 10 10 'magic missile' 0",
      type: ImportItemType.Staff,
    })

    // expect
    expect(item).toBeInstanceOf(ItemEntity)
    expect(item.weaponType).toBe(WeaponType.Stave)
  })

  it("should build armor", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "head",
      type: ImportItemType.Armor,
    })

    // expect
    expect(item.itemType).toBe(ItemType.Equipment)
    expect(item.equipment).toBe(Equipment.Head)

    // given
    const clothing = await itemBuilder.createItemFromImportData({
      pObjFlags: "arms",
      type: ImportItemType.Clothing,
    })

    // expect
    expect(item.itemType).toBe(ItemType.Equipment)
    expect(clothing.equipment).toBe(Equipment.Arms)
  })

  it("should build a container", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "10 AB water 1",
      type: ImportItemType.Container,
    })

    // expect
    expect(item.itemType).toBe(ItemType.Container)
    expect(item.container.weightCapacity).toBe(10)
    expect(item.drink.liquid).toBe(Liquid.Water)
    expect(item.container.maxWeightForItem).toBe(1)
    expect(item.affects.some(affect => affect.affectType === AffectType.Glow)).toBeTruthy()
    expect(item.affects.some(affect => affect.affectType === AffectType.Hum)).toBeTruthy()
    expect(item.affects).toHaveLength(2)
  })

  it("should build a drink", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "1 2 milk 0",
      type: ImportItemType.Drink,
    })

    // expect
    expect(item.itemType).toBe(ItemType.Drink)
    expect(item.drink.drinkAmount).toBe(2)
    expect(item.drink.capacity).toBe(2)
    expect(item.drink.liquid).toBe(Liquid.Milk)
    expect(item.drink.foodAmount).toBe(1)
  })

  it("should build a poisoned drink", async () => {
    // given
    const poisonDrink = await itemBuilder.createItemFromImportData({
      pObjFlags: "1 2 milk 1",
      type: ImportItemType.Drink,
    })

    // expect
    expect(poisonDrink.affects.find(affect => affect.affectType === AffectType.Poison)).toBeTruthy()
  })

  it("should build food", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "1 2",
      type: ImportItemType.Food,
    })

    // expect
    expect(item.itemType).toBe(ItemType.Food)
    expect(item.food.foodAmount).toBe(1)
    expect(item.food.drinkAmount).toBe(2)
  })

  it("should build poisoned food", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "1 2 0 1",
      type: ImportItemType.Food,
    })

    // expect
    expect(item.affects.find(affect => affect.affectType === AffectType.Poison)).toBeTruthy()
  })

  it("should build a fountain", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "1 2 water 0",
      type: ImportItemType.Fountain,
    })

    // expect
    expect(item.itemType).toBe(ItemType.Fountain)
    expect(item.drink.foodAmount).toBe(1)
    expect(item.drink.drinkAmount).toBe(2)
    expect(item.isTransferable).toBeFalsy()
    expect(item.drink.liquid).toBe(Liquid.Water)
  })

  it("should build a poisoned fountain", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "1 2 water 1",
      type: ImportItemType.Fountain,
    })

    // expect
    expect(item.affects.find(affect => affect.affectType === AffectType.Poison)).toBeTruthy()
  })

  it("should build a forge", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "1 2 3 4 5",
      type: ImportItemType.Forge,
    })

    // expect
    expect(item.itemType).toBe(ItemType.Forge)
    expect(item.isTransferable).toBeFalsy()
    expect(item.forge).toBeInstanceOf(ForgeEntity)
  })

  it("should build a light", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "0 0 50 0 0",
      type: ImportItemType.Light,
    })

    // expect
    expect(item.itemType).toBe(ItemType.Equipment)
    expect(item.equipment).toBe(Equipment.Held)
    expect(item.wearTimer).toBe(50)
  })

  it("should build furniture", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "0 0 0 0 0",
      type: ImportItemType.Furniture,
    })

    // expect
    expect(item.itemType).toBe(ItemType.Furniture)
    expect(item.isTransferable).toBeFalsy()
  })

  it("should build a map", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "0 0 0 0 0",
      type: ImportItemType.Map,
    })

    // expect
    expect(item.itemType).toBe(ItemType.Map)
  })
})
