import {AffectType} from "../../../affect/enum/affectType"
import {newAffect} from "../../../affect/factory/affectFactory"
import {createTestAppContainer} from "../../../app/testFactory"
import {RaceType} from "../../../mob/race/enum/raceType"
import {Terrain} from "../../../region/enum/terrain"
import newRegion from "../../../region/factory"
import {RequestType} from "../../../request/enum/requestType"
import {ResponseStatus} from "../../../request/enum/responseStatus"
import RoomBuilder from "../../../support/test/roomBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"

let testRunner: TestRunner
let roomBuilder: RoomBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.setTime(12)
  roomBuilder = testRunner.createRoom()
})

describe("look action", () => {
  it("describes a room when no arguments are provided", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Look)

    // then
    const message = response.getMessageToRequestCreator()
    expect(message).toContain(roomBuilder.room.name)
    expect(message).toContain(roomBuilder.room.description)
  })

  it("lets the player know if the thing they want to look at does not exist", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Look, "look foo")

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(Messages.Look.NotFound)
  })

  it("describes a mob when a mob has present", async () => {
    // given
    const mobBuilder = testRunner.createMob()

    // when
    const response = await testRunner.invokeAction(
      RequestType.Look, `look ${mobBuilder.getMobName()}`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(mobBuilder.mob.describe())
  })

  it("does not describe a mob when a mob has invisible", async () => {
    // given
    const mobBuilder = testRunner.createMob()
      .addAffectType(AffectType.Invisible)

    // when
    const response = await testRunner.invokeAction(RequestType.Look)

    // then
    expect(response.getMessageToRequestCreator()).not.toContain(mobBuilder.getMobName())
  })

  it("does not describe a mob when a mob has hidden", async () => {
    // given
    const mobBuilder = testRunner.createMob()
      .addAffectType(AffectType.Hidden)

    // when
    const response = await testRunner.invokeAction(RequestType.Look)

    // then
    expect(response.getMessageToRequestCreator()).not.toContain(mobBuilder.getMobName())
  })

  it("describes a mob when a mob has hidden and the request creator has detect hidden", async () => {
    // given
    testRunner.createMob().addAffectType(AffectType.DetectHidden)
    const mobBuilder = testRunner.createMob()
      .addAffectType(AffectType.Hidden)

    // when
    const response = await testRunner.invokeAction(RequestType.Look)

    // then
    expect(response.getMessageToRequestCreator()).toContain(mobBuilder.getMobName())
  })

  it("describes a mob when a mob has invisible and the request creator can detect invisible", async () => {
    // given
    testRunner.createMob().addAffectType(AffectType.DetectInvisible)
    const mobBuilder = testRunner.createMob().addAffectType(AffectType.Invisible)

    // when
    const response = await testRunner.invokeAction(RequestType.Look)

    // then
    expect(response.getMessageToRequestCreator()).toContain(mobBuilder.getMobName())
  })

  it("can describe an item in the room", async () => {
    // given
    const item = testRunner.createItem().asShield().build()
    testRunner.getStartRoom().addItem(item)

    // when
    const response = await testRunner.invokeAction(RequestType.Look, "look shield")

    // then
    expect(response.getMessageToRequestCreator()).toBe(item.description)
  })

  it("can describe an item in the session mob's inventory", async () => {
    // given
    const item = testRunner.createItem().asShield().build()
    testRunner.createMob().addItem(item)

    // when
    const response = await testRunner.invokeAction(RequestType.Look, `look '${item.name}'`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(item.description)
  })

  it("cannot be able to see if blind", async () => {
    // given
    testRunner.createMob().addAffectType(AffectType.Blind)

    // when
    const response = await testRunner.invokeAction(RequestType.Look)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Look.Fail)
  })

  it("can see in a dark room if holding something glowing", async () => {
    // given
    testRunner.setTime(0)
    const room = testRunner.getStartRoom()
    room.setRegion(newRegion("test", Terrain.Forest))
    const mobBuilder = testRunner.createMob().setRace(RaceType.HalfOrc)

    // when
    const response1 = await testRunner.invokeAction(RequestType.Look)

    // then
    expect(response1.getMessageToRequestCreator()).toBe(Messages.Look.Fail)
    expect(response1.status).toBe(ResponseStatus.PreconditionsFailed)

    // and
    const item = testRunner.createItem().asHelmet().build()
    item.affect().add(newAffect(AffectType.Glow))
    mobBuilder.equip(item)

    // when
    const response2 = await testRunner.invokeAction(RequestType.Look)

    // then
    const message = response2.getMessageToRequestCreator()
    expect(response2.status).toBe(ResponseStatus.Info)
    expect(message).toContain(`Test room 1

This is a test room.`)
  })
})
