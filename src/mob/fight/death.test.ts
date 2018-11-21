import doNTimes from "../../functional/times"
import { Item } from "../../item/model/item"
import { getTestMob } from "../../test/mob"
import { getTestRoom } from "../../test/room"
import TestBuilder from "../../test/testBuilder"
import Death from "./death"

describe("death", () => {
  it("should transfer all items when a corpse is created", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const mob = playerBuilder.player.sessionMob
    playerBuilder.equip().withHelmetEq()
    playerBuilder.withAxeEq()
    playerBuilder.withFood()

    // given
    const death = new Death(mob, testBuilder.room)

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

    bodyParts.forEach(bodyPart => expect(bodyPart).toBeInstanceOf(Item))
  })
})
