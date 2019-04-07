import {AffectType} from "../../../affect/affectType"
import {newAffect} from "../../../affect/factory"
import {Item} from "../../../item/model/item"
import {Mob} from "../../../mob/model/mob"
import {RaceType} from "../../../mob/race/enum/raceType"
import {Player} from "../../../player/model/player"
import {Terrain} from "../../../region/enum/terrain"
import newRegion from "../../../region/factory"
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
  mob.brief = "alice has here"
})

function getTestItem(): Item {
  const item = new Item()
  item.name = "a pirate hat"
  item.description = "this has a test item"
  return item
}

describe("look action", () => {
  it("describes a room when no arguments are provided", async () => {
    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Look))
    const message = response.getMessageToRequestCreator()

    // then
    expect(message).toContain(room.name)
    expect(message).toContain(room.description)
  })

  it("lets the player know if the thing they want to look at does not exist", async () => {
    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Look, "look foo"))

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toBe(Messages.Look.NotFound)
  })

  it("describes a mob when a mob has present", async () => {
    // when
    const response = await definition.handle(
      testBuilder.createRequest(RequestType.Look, "look alice"))

    // then
    expect(response.getMessageToRequestCreator()).toBe(mob.describe())
  })

  it("does not describe a mob when a mob has invisible", async () => {
    // given
    mob.affect().add(newAffect(AffectType.Invisible))

    // when
    const response = await definition.handle(
      testBuilder.createRequest(RequestType.Look))

    // then
    expect(response.getMessageToRequestCreator()).not.toContain("alice")
  })

  it("does not describe a mob when a mob has hidden", async () => {
    // given
    mob.affect().add(newAffect(AffectType.Hidden))

    // when
    const response = await definition.handle(
      testBuilder.createRequest(RequestType.Look))

    // then
    expect(response.getMessageToRequestCreator()).not.toContain("alice")
  })

  it("describes a mob when a mob has hidden and the request creator has detect hidden", async () => {
    // given
    mob.affect().add(newAffect(AffectType.Hidden))
    player.sessionMob.affect().add(newAffect(AffectType.DetectHidden))

    // when
    const response = await definition.handle(
      testBuilder.createRequest(RequestType.Look))

    // then
    expect(response.getMessageToRequestCreator()).toContain("alice")
  })

  it("describes a mob when a mob has invisible and the request creator can detect invisible", async () => {
    // given
    player.sessionMob.affect().add(newAffect(AffectType.DetectInvisible))
    mob.affect().add(newAffect(AffectType.Invisible))

    // when
    const response = await definition.handle(
      testBuilder.createRequest(RequestType.Look))

    // then
    expect(response.getMessageToRequestCreator()).toContain("alice")
  })

  it("can describe an item in the room", async () => {
    // given
    const item = getTestItem()
    room.inventory.addItem(item)
    const service = await testBuilder.getService()
    service.itemService.add(item)

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Look, "look pirate"))

    // then
    expect(response.getMessageToRequestCreator()).toBe(item.description)
  })

  it("can describe an item in the session mob's inventory", async () => {
    // given
    const item = getTestItem()
    player.sessionMob.inventory.addItem(item)
    const service = await testBuilder.getService()
    service.itemService.add(item)

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Look, "look pirate"))

    // then
    expect(response.getMessageToRequestCreator()).toBe(item.description)
  })

  it("cannot be able to see if blind", async () => {
    // given
    player.sessionMob.affect().add(newAffect(AffectType.Blind))

    // when
    const response = await testBuilder.handleAction(RequestType.Look)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Look.Fail)
  })

  it("can see in a dark room if holding something glowing", async () => {
    // given
    room.region = newRegion("test", Terrain.Forest)
    const service = await testBuilder.getService()
    service.stateService.timeService.time = 0
    player.sessionMob.raceType = RaceType.HalfOrc

    // when
    const response1 = await testBuilder.handleAction(RequestType.Look)

    // then
    expect(response1.getMessageToRequestCreator()).toBe(Messages.Look.Fail)
    expect(response1.status).toBe(ResponseStatus.PreconditionsFailed)

    // and
    const item = getTestItem()
    item.affect().add(newAffect(AffectType.Glow))
    service.itemService.add(item)
    player.sessionMob.equipped.addItem(item)

    // when
    const response2 = await testBuilder.handleAction(RequestType.Look)

    // then
    const message = response2.getMessageToRequestCreator()
    expect(response2.status).toBe(ResponseStatus.Info)
    expect(message).toContain(room.name)
    expect(message).toContain(room.description)
  })
})
