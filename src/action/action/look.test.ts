import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { Item } from "../../item/model/item"
import { Race } from "../../mob/race/race"
import { Player } from "../../player/model/player"
import newRegion from "../../region/factory"
import { Terrain } from "../../region/terrain"
import { Weather } from "../../region/weather"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import { Room } from "../../room/model/room"
import TestBuilder from "../../test/testBuilder"
import getActionCollection from "../actionCollection"
import { Definition } from "../definition/definition"
import { MESSAGE_LOOK_CANNOT_SEE, NOT_FOUND } from "./constants"

let testBuilder: TestBuilder
let room: Room
let player: Player
let definition: Definition

beforeEach(async () => {
  testBuilder = new TestBuilder()
  testBuilder.setTime(12)
  room = testBuilder.withRoom().room
  const playerBuilder = await testBuilder.withPlayer()
  player = playerBuilder.player
})

function getTestItem(): Item {
  const item = new Item()
  item.name = "a pirate hat"
  item.description = "this is a test item"
  return item
}

describe("look", () => {
  it("should describe a room when no arguments are provided", async () => {
    // setup
    const actionCollection = await getActionCollection(await testBuilder.getService())
    definition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Look)

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Look))
    const message = response.message.getMessageToRequestCreator()

    // then
    expect(message).toContain(room.name)
    expect(message).toContain(room.description)
  })

  it("should let the player know if the thing they want to look at does not exist", async () => {
    // setup
    const actionCollection = await getActionCollection(await testBuilder.getService())
    definition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Look)

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Look, "look foo"))

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.message.getMessageToRequestCreator()).toBe(NOT_FOUND)
  })

  it("should describe a mob when a mob is present", async () => {
    // setup
    const actionCollection = await getActionCollection(await testBuilder.getService())
    definition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Look)

    // given
    const mob = testBuilder.withMob("alice").mob

    // when
    const response = await definition.handle(
      testBuilder.createRequest(RequestType.Look, "look alice"))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(mob.description)
  })

  it("should be able to describe an item in the room", async () => {
    // setup
    const actionCollection = await getActionCollection(await testBuilder.getService())
    definition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Look)

    // given
    const item = getTestItem()
    room.inventory.addItem(item)
    const service = await testBuilder.getService()
    service.itemTable.add(item)

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Look, "look pirate"))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(item.description)
  })

  it("should be able to describe an item in the session mob's inventory", async () => {
    // setup
    const actionCollection = await getActionCollection(await testBuilder.getService())
    definition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Look)

    // given
    const item = getTestItem()
    player.sessionMob.inventory.addItem(item)
    const service = await testBuilder.getService()
    service.itemTable.add(item)

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Look, "look pirate"))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(item.description)
  })

  it("should not be able to see if blind", async () => {
    // setup
    const actionCollection = await getActionCollection(await testBuilder.getService())
    definition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Look)

    // given
    player.sessionMob.addAffect(newAffect(AffectType.Blind))

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Look))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(MESSAGE_LOOK_CANNOT_SEE)
  })

  it("should see in a dark room if holding something glowing", async () => {
    // setup
    testBuilder.setTime(0)
    const actionCollection = await getActionCollection(await testBuilder.getService())
    definition = actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.Look)

    // given
    room.region = newRegion("test", Terrain.Forest, Weather.Storming)
    const service = await testBuilder.getService()
    player.sessionMob.race = Race.HalfOrc

    // when
    const response1 = await definition.handle(testBuilder.createRequest(RequestType.Look))

    // then
    expect(response1.message.getMessageToRequestCreator()).toBe(MESSAGE_LOOK_CANNOT_SEE)
    expect(response1.status).toBe(ResponseStatus.ActionFailed)

    // and
    const item = getTestItem()
    item.affects.push(newAffect(AffectType.Glow))
    service.itemTable.add(item)
    player.sessionMob.equipped.inventory.addItem(item)

    // when
    const response2 = await definition.handle(testBuilder.createRequest(RequestType.Look))

    // then
    const message = response2.message.getMessageToRequestCreator()
    expect(response2.status).toBe(ResponseStatus.Info)
    expect(message).toContain(room.name)
    expect(message).toContain(room.description)
  })
})
