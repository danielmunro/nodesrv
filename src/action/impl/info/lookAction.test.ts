import {AffectType} from "../../../affect/affectType"
import {newAffect} from "../../../affect/factory"
import {Item} from "../../../item/model/item"
import {Mob} from "../../../mob/model/mob"
import {RaceType} from "../../../mob/race/raceType"
import {Player} from "../../../player/model/player"
import newRegion from "../../../region/factory"
import {Terrain} from "../../../region/terrain"
import {Weather} from "../../../region/weather"
import {RequestType} from "../../../request/requestType"
import {ResponseStatus} from "../../../request/responseStatus"
import {Room} from "../../../room/model/room"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {Messages} from "../../constants"

let testBuilder: TestBuilder
let room: Room
let player: Player
let definition: Action
let mob: Mob

beforeEach(async () => {
  testBuilder = new TestBuilder()
  testBuilder.setTime(12)
  room = testBuilder.withRoom().room
  const playerBuilder = await testBuilder.withPlayer()
  player = playerBuilder.player
  definition = await testBuilder.getAction(RequestType.Look)
  mob = testBuilder.withMob("alice").mob
  mob.brief = "alice is here"
})

function getTestItem(): Item {
  const item = new Item()
  item.name = "a pirate hat"
  item.description = "this is a test item"
  return item
}

describe("look action", () => {
  it("should describe a room when no arguments are provided", async () => {
    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Look))
    const message = response.message.getMessageToRequestCreator()

    // then
    expect(message).toContain(room.name)
    expect(message).toContain(room.description)
  })

  it("should let the player know if the thing they want to look at does not exist", async () => {
    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Look, "look foo"))

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Look.NotFound)
  })

  it("should describe a mob when a mob is present", async () => {
    // when
    const response = await definition.handle(
      testBuilder.createRequest(RequestType.Look, "look alice"))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(mob.describe())
  })

  it("should not describe a mob when a mob is invisible", async () => {
    // given
    mob.addAffect(newAffect(AffectType.Invisible))

    // when
    const response = await definition.handle(
      testBuilder.createRequest(RequestType.Look))

    // then
    expect(response.message.getMessageToRequestCreator()).not.toContain("alice")
  })

  it("should describe a mob when a mob is invisible and the request creator can detect invisible", async () => {
    // given
    player.sessionMob.addAffect(newAffect(AffectType.DetectInvisible))
    mob.addAffect(newAffect(AffectType.Invisible))

    // when
    const response = await definition.handle(
      testBuilder.createRequest(RequestType.Look))

    // then
    expect(response.message.getMessageToRequestCreator()).toContain("alice")
  })

  it("should be able to describe an item in the room", async () => {
    // given
    const item = getTestItem()
    room.inventory.addItem(item)
    const service = await testBuilder.getService()
    service.itemService.add(item)

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Look, "look pirate"))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(item.description)
  })

  it("should be able to describe an item in the session mob's inventory", async () => {
    // given
    const item = getTestItem()
    player.sessionMob.inventory.addItem(item)
    const service = await testBuilder.getService()
    service.itemService.add(item)

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Look, "look pirate"))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(item.description)
  })

  it("should not be able to see if blind", async () => {
    // given
    player.sessionMob.addAffect(newAffect(AffectType.Blind))

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Look))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Look.Fail)
  })

  it("should see in a dark room if holding something glowing", async () => {
    // given
    room.region = newRegion("test", Terrain.Forest, Weather.Storming)
    const service = await testBuilder.getService()
    service.timeService.time = 0
    player.sessionMob.race = RaceType.HalfOrc

    // when
    const response1 = await definition.handle(testBuilder.createRequest(RequestType.Look))

    // then
    expect(response1.message.getMessageToRequestCreator()).toBe(Messages.Look.Fail)
    expect(response1.status).toBe(ResponseStatus.PreconditionsFailed)

    // and
    const item = getTestItem()
    item.affects.push(newAffect(AffectType.Glow))
    service.itemService.add(item)
    player.sessionMob.equipped.addItem(item)

    // when
    const response2 = await definition.handle(testBuilder.createRequest(RequestType.Look))

    // then
    const message = response2.message.getMessageToRequestCreator()
    expect(response2.status).toBe(ResponseStatus.Info)
    expect(message).toContain(room.name)
    expect(message).toContain(room.description)
  })
})
