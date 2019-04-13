import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import MobService from "../../../../mob/mobService"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../support/functional/times"
import MobBuilder from "../../../../support/test/mobBuilder"
import RoomBuilder from "../../../../support/test/roomBuilder"
import TestBuilder from "../../../../support/test/testBuilder"
import Spell from "../../spell"

let testBuilder: TestBuilder
let mobService: MobService
let spell: Spell
let caster: MobBuilder
let target: MobBuilder
let room1: RoomBuilder
let room2: RoomBuilder
const castCommand = "cast 'word of recall'"
const responseMessage = "you disappear in a flash."

beforeEach(async () => {
  testBuilder = new TestBuilder()
  room1 = testBuilder.withRoom()
  room2 = testBuilder.withRoom()
  spell = await testBuilder.getSpell(SpellType.WordOfRecall)
  caster = testBuilder.withMob()
    .withSpell(SpellType.WordOfRecall, MAX_PRACTICE_LEVEL)
    .setLevel(30)
    .addToRoom(room2)
  target = testBuilder.withMob()
    .addToRoom(room2)
  mobService = await testBuilder.getMobService()
})

describe("word of recall spell action", () => {
  it("moves a target to the room of recall when invoked", async () => {
    // when
    await getSuccessfulAction(
      spell,
      testBuilder.createRequest(RequestType.Cast, `cast 'word' ${target.getMobName()}`,
      target.mob))

    // then
    expect(mobService.getLocationForMob(target.mob).room).toBe(room1.room)
  })

  it("moves self to the room of recall when invoked", async () => {
    // when
    await getSuccessfulAction(
      spell,
      testBuilder.createRequest(RequestType.Cast, "cast 'word'", caster.mob))

    // then
    expect(mobService.getLocationForMob(caster.mob).room).toBe(room1.room)
  })

  it("generates accurate success messages when casting on a target", async () => {
    // when
    const response = await getSuccessfulAction(
      spell, testBuilder.createRequest(RequestType.Cast, castCommand, target.mob))

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} disappears in a flash.`)
    expect(response.message.getMessageToTarget()).toBe(responseMessage)
    expect(response.message.getMessageToObservers()).toBe(`${target.getMobName()} disappears in a flash.`)
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await getSuccessfulAction(
      spell, testBuilder.createRequest(RequestType.Cast, castCommand, caster.mob))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(responseMessage)
    expect(response.message.getMessageToTarget()).toBe(responseMessage)
    expect(response.message.getMessageToObservers()).toBe(`${caster.getMobName()} disappears in a flash.`)
  })
})
