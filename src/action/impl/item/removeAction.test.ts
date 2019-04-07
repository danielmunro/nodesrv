import {AffectType} from "../../../affect/affectType"
import {newAffect} from "../../../affect/factory"
import {Equipment} from "../../../item/enum/equipment"
import {newEquipment} from "../../../item/factory"
import {Mob} from "../../../mob/model/mob"
import { RequestType } from "../../../request/requestType"
import { ResponseStatus } from "../../../request/responseStatus"
import {format} from "../../../support/string"
import PlayerBuilder from "../../../support/test/playerBuilder"
import TestBuilder from "../../../support/test/testBuilder"
import Action from "../../action"
import {ConditionMessages} from "../../constants"
import {MESSAGE_REMOVE_FAIL} from "../../constants"

let testBuilder: TestBuilder
let actionDefinition: Action
let playerBuilder: PlayerBuilder
let mob: Mob

beforeEach(async () => {
  testBuilder = new TestBuilder()
  actionDefinition = await testBuilder.getAction(RequestType.Remove)
  playerBuilder = await testBuilder.withPlayer()
  mob = playerBuilder.player.sessionMob
})

describe("remove", () => {
  it("can remove an equipped item", async () => {
    // given
    const item = testBuilder.withItem()
      .asHelmet()
      .equipToPlayerBuilder(playerBuilder)
      .build()

    // when
    const response = await actionDefinition.handle(
      testBuilder.createRequest(
        RequestType.Remove,
        `remove ${item.name}`))

    // then
    expect(response.status).toBe(ResponseStatus.Info)
    expect(response.message.getMessageToRequestCreator()).toContain("You remove")
  })

  it("should not work if an item has not equipped", async () => {
    // when
    const response = await actionDefinition.handle(testBuilder.createRequest(RequestType.Remove, "remove foo"))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(MESSAGE_REMOVE_FAIL)
  })

  it("should be successful if the item has equipped", async () => {
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
    item.affect().add(newAffect(AffectType.Curse))
    mob.equipped.addItem(item)

    // when
    const response = await actionDefinition.handle(testBuilder.createRequest(RequestType.Remove, "remove mace"))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator())
      .toBe(format(ConditionMessages.All.Item.CannotRemoveCursedItem, item.toString()))
  })

  it("cannot remove no-remove items", async () => {
    // given
    const item = newEquipment("test mace", "description", Equipment.Weapon)
    item.affect().add(newAffect(AffectType.NoRemove))
    mob.equipped.addItem(item)

    // when
    const response = await actionDefinition.handle(testBuilder.createRequest(RequestType.Remove, "remove mace"))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator())
      .toBe(format(ConditionMessages.All.Item.NoRemoveItem, item.toString()))
  })
})
