import {createTestAppContainer} from "../../../../app/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {newMobLocation} from "../../../../mob/factory"
import LocationService from "../../../../mob/service/locationService"
import MobService from "../../../../mob/service/mobService"
import {RequestType} from "../../../../request/enum/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let mobService: MobService
let caster: MobBuilder
let target: MobBuilder
const castCommand = "cast 'word of recall'"
const responseMessage = "you disappear in a flash."

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  const room = testRunner.createRoom()
  caster = testRunner.createMob()
    .withSpell(SpellType.WordOfRecall, MAX_PRACTICE_LEVEL)
    .setLevel(30)
  const locationService = app.get<LocationService>(Types.LocationService)
  locationService.addMobLocation(newMobLocation(caster.mob, room.get()))
  target = testRunner.createMob()
  locationService.addMobLocation(newMobLocation(target.mob, room.get()))
  mobService = app.get<MobService>(Types.MobService)
})

describe("word of recall spell action", () => {
  it("moves a target to the room of recall when invoked", async () => {
    // when
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast 'word' ${target.getMobName()}`,
      target.get())

    // then
    expect(mobService.getLocationForMob(target.get()).room).toBe(testRunner.getStartRoom().room)
  })

  it("moves self to the room of recall when invoked", async () => {
    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast 'word'", caster.get())

    // then
    expect(mobService.getLocationForMob(caster.get()).room).toBe(testRunner.getStartRoom().room)
  })

  it("generates accurate success messages when casting on a target", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, castCommand, target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} disappears in a flash.`)
    expect(response.getMessageToTarget()).toBe(responseMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} disappears in a flash.`)
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, castCommand, caster.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(responseMessage)
    expect(response.getMessageToTarget()).toBe(responseMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()} disappears in a flash.`)
  })
})
