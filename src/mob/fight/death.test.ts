import {createTestAppContainer} from "../../app/factory/testFactory"
import { ItemEntity } from "../../item/entity/itemEntity"
import doNTimes from "../../support/functional/times"
import { getTestMob } from "../../support/test/mob"
import { getTestRoom } from "../../support/test/room"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import Death from "./death"

describe("death event consumer", () => {
  it("transfers all items when a corpse is created", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    const playerBuilder = await testRunner.createPlayer()
    const mob = playerBuilder.player.sessionMob
    playerBuilder.equip(testRunner.createItem()
      .asHelmet()
      .build())
    playerBuilder.addItem(testRunner.createWeapon()
      .asAxe()
      .build())
    playerBuilder.addItem(testRunner.createItem()
      .asFood()
      .build())

    // given
    const death = new Death(mob, testRunner.getStartRoom().get())

    // when
    const corpse = death.createCorpse()

    // then
    expect(corpse.container.inventory.items.length).toBe(3)
    expect(mob.inventory.items.length).toBe(0)
    expect(mob.equipped.items.length).toBe(0)
  })

  it("should not calculate kill xp for non-players", () => {
    const death = new Death(getTestMob(), getTestRoom(), getTestMob())

    expect(death.calculateKillerExperience()).toBe(0)
  })

  it("should generate random body parts", async () => {
    const death = new Death(getTestMob(), getTestRoom(), getTestMob())
    const bodyParts = await doNTimes(10, () => death.createBodyPart())

    bodyParts.forEach(bodyPart => expect(bodyPart).toBeInstanceOf(ItemEntity))
  })
})
