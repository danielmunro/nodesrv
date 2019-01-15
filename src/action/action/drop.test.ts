import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { Item } from "../../item/model/item"
import { Mob } from "../../mob/model/mob"
import { RequestType } from "../../request/requestType"
import { Room } from "../../room/model/room"
import TestBuilder from "../../test/testBuilder"
import { Action } from "../action"

let testBuilder: TestBuilder
let actionDefinition: Action
let room: Room
let mob: Mob
let equipment: Item

beforeEach(async () => {
  testBuilder = new TestBuilder()
  room = testBuilder.withRoom().room
  const playerBuilder = await testBuilder.withPlayer()
  mob = playerBuilder.player.sessionMob
  equipment = playerBuilder.withHelmetEq()
  actionDefinition = await testBuilder.getActionDefinition(RequestType.Drop)
})

describe("drop", () => {
  it("should be able to drop an item", async () => {
    // when
    const response = await actionDefinition.handle(
      testBuilder.createRequest(RequestType.Drop, "drop cap", equipment))

    // then
    const message = response.message.getMessageToRequestCreator()
    expect(message).toContain("you drop")
    expect(message).toContain(equipment.name)
    expect(room.inventory.items).toHaveLength(1)
    expect(mob.inventory.items).toHaveLength(0)
  })

  it("an item with MeltDrop affect should destroy on drop", async () => {
    // given
    equipment.affects.push(newAffect(AffectType.MeltDrop))

    // when
    const response = await actionDefinition.handle(
      testBuilder.createRequest(RequestType.Drop, "drop cap", equipment))

    // then
    const message = response.message.getMessageToRequestCreator()
    expect(message).toContain("you drop")
    expect(message).toContain(equipment.name)
  })
})
