import {AffectType} from "../affect/affectType"
import {DamageType} from "../damage/damageType"
import {ItemType} from "../import/enum/itemType"
import armor from "./builder/armor"
import container from "./builder/container"
import drink from "./builder/drink"
import food from "./builder/food"
import fountain from "./builder/fountain"
import weapon from "./builder/weapon"
import BuilderDefinition from "./builderDefinition"
import {Equipment} from "./equipment"
import ItemBuilder from "./itemBuilder"
import {Liquid} from "./liquid"
import Weapon from "./model/weapon"
import {WeaponType} from "./weaponType"

const itemBuilder = new ItemBuilder([
  new BuilderDefinition(ItemType.Weapon, weapon),
  new BuilderDefinition(ItemType.Armor, armor),
  new BuilderDefinition(ItemType.Clothing, armor),
  new BuilderDefinition(ItemType.Container, container),
  new BuilderDefinition(ItemType.Drink, drink),
  new BuilderDefinition(ItemType.Food, food),
  new BuilderDefinition(ItemType.Fountain, fountain),
])

describe("itemBuilder", () => {
  it("should build a weapon", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "sword (null) slash",
      type: ItemType.Weapon,
    }) as Weapon

    // expect
    expect(item).toBeInstanceOf(Weapon)
    expect(item.damageType).toBe(DamageType.Slash)
    expect(item.weaponType).toBe(WeaponType.Sword)
  })

  it("should build armor", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "head",
      type: ItemType.Armor,
    })

    // expect
    expect(item.equipment).toBe(Equipment.Head)

    // given
    const clothing = await itemBuilder.createItemFromImportData({
      pObjFlags: "arms",
      type: ItemType.Clothing,
    })

    // expect
    expect(clothing.equipment).toBe(Equipment.Arms)
  })

  it("should build a container", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "10 AB water 1",
      type: ItemType.Container,
    })

    // expect
    expect(item.container.weightCapacity).toBe(10)
    expect(item.container.liquid).toBe(Liquid.Water)
    expect(item.container.maxWeightForItem).toBe(1)
    expect(item.affects.some(affect => affect.affectType === AffectType.Glow)).toBeTruthy()
    expect(item.affects.some(affect => affect.affectType === AffectType.Hum)).toBeTruthy()
    expect(item.affects).toHaveLength(2)
  })

  it("should build a drink", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "1 2 milk 0",
      type: ItemType.Drink,
    })

    expect(item.drink.drinkAmount).toBe(2)
    expect(item.drink.capacity).toBe(2)
    expect(item.drink.liquid).toBe(Liquid.Milk)
    expect(item.drink.foodAmount).toBe(1)
  })

  it("should build a poisoned drink", async () => {
    // given
    const poisonDrink = await itemBuilder.createItemFromImportData({
      pObjFlags: "1 2 milk 1",
      type: ItemType.Drink,
    })

    // expect
    expect(poisonDrink.affects.find(affect => affect.affectType === AffectType.Poison)).toBeTruthy()
  })

  it("should build food", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "1 2",
      type: ItemType.Food,
    })

    // expect
    expect(item.food.foodAmount).toBe(1)
    expect(item.food.drinkAmount).toBe(2)
  })

  it("should build poisoned food", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "1 2 0 1",
      type: ItemType.Food,
    })

    // expect
    expect(item.affects.find(affect => affect.affectType === AffectType.Poison)).toBeTruthy()
  })

  it("should build a fountain", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "1 2 water 0",
      type: ItemType.Fountain,
    })

    // expect
    expect(item.drink.foodAmount).toBe(1)
    expect(item.drink.drinkAmount).toBe(2)
    expect(item.isTransferable).toBeFalsy()
    expect(item.drink.liquid).toBe(Liquid.Water)
  })

  it("should build a poisoned fountain", async () => {
    // given
    const item = await itemBuilder.createItemFromImportData({
      pObjFlags: "1 2 water 1",
      type: ItemType.Fountain,
    })

    // expect
    expect(item.affects.find(affect => affect.affectType === AffectType.Poison)).toBeTruthy()
  })
})
