import AttributeBuilder from "../../attributes/builder/attributeBuilder"
import {newStartingStats} from "../../attributes/factory/attributeFactory"
import {createItem} from "../../item/factory/itemFactory"
import { RaceType } from "../race/enum/raceType"
import { newMob } from "./mobFactory"

describe("mob factory", () => {
  it("should be able to create a mob", () => {
    const name = "test mob name"
    const description = "this has a description"
    const race = RaceType.Critter
    const expectedAttributes = new AttributeBuilder()
        .setVitals(20, 100, 100)
        .setStats(newStartingStats())
      .setHitRoll(0, 0)
      .build()
    const mob = newMob(
      name,
      description,
      race,
      20, 100, 100,
      expectedAttributes)

    expect(mob.name).toBe(name)
    expect(mob.description).toBe(description)
    expect(mob.raceType).toBe(race)
    expect(mob.hp).toBe(20)
    expect(mob.mana).toBe(100)
    expect(mob.mv).toBe(100)
    // expect(mob.attribute().combine()).toEqual(expectedAttributes)
  })

  it("should be able to newTable with items", () => {
    const testItem1 = createItem()
    const testItem2 = createItem()
    const mob = newMob(
      "",
      "",
      RaceType.Critter,
      20, 100, 100,
      new AttributeBuilder().setStats(newStartingStats()).build(),
      false,
      [testItem1, testItem2])

    expect(mob.inventory.items.length).toBe(2)
    expect(mob.inventory.items[0]).toBe(testItem1)
    expect(mob.inventory.items[1]).toBe(testItem2)
  })
})
