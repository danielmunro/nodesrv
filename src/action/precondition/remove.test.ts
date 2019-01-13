import {AffectType} from "../../affect/affectType"
import {newAffect} from "../../affect/factory"
import {Equipment} from "../../item/equipment"
import {newEquipment} from "../../item/factory"
import {Mob} from "../../mob/model/mob"
import {RequestType} from "../../request/requestType"
import {ResponseStatus} from "../../request/responseStatus"
import {format} from "../../support/string"
import TestBuilder from "../../test/testBuilder"
import {Definition} from "../definition/definition"
import {MESSAGE_REMOVE_FAIL, Messages} from "./constants"

let testBuilder: TestBuilder
let actionDefinition: Definition
let mob: Mob

beforeEach(async () => {
  testBuilder = new TestBuilder()
  actionDefinition = await testBuilder.getActionDefinition(RequestType.Remove)
  mob = (await testBuilder.withPlayer()).player.sessionMob
})

describe("remove", () => {
  it("should not work if an item is not equipped", async () => {
    // when
    const response = await actionDefinition.handle(testBuilder.createRequest(RequestType.Remove, "remove foo"))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(MESSAGE_REMOVE_FAIL)
  })

  it("should be successful if the item is equipped", async () => {
    // given
    const eq = newEquipment("a cowboy hat", "a sturdy cowboy hat", Equipment.Head)
    mob.equipped.addItem(eq)

    // when
    const response = await actionDefinition.handle(testBuilder.createRequest(RequestType.Remove, "remove cowboy"))

    // then
    expect(response.status).toBe(ResponseStatus.Info)
  })

  it("cannot remove cursed items", async () => {
    // given
    const item = newEquipment("test mace", "description", Equipment.Weapon)
    item.affects.push(newAffect(AffectType.Curse))
    mob.equipped.addItem(item)

    // when
    const response = await actionDefinition.handle(testBuilder.createRequest(RequestType.Remove, "remove mace"))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator())
      .toBe(format(Messages.All.Item.CannotRemoveCursedItem, item.toString()))
  })

  it("cannot remove no-remove items", async () => {
    // given
    const item = newEquipment("test mace", "description", Equipment.Weapon)
    item.affects.push(newAffect(AffectType.NoRemove))
    mob.equipped.addItem(item)

    // when
    const response = await actionDefinition.handle(testBuilder.createRequest(RequestType.Remove, "remove mace"))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator())
      .toBe(format(Messages.All.Item.NoRemoveItem, item.toString()))
  })
})
