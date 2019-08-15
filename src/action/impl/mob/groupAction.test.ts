import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import MobService from "../../../mob/service/mobService"
import Group from "../../../mob/type/group"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
let mobService: MobService
let mob1: MobBuilder
let mob2: MobBuilder
let mob3: MobBuilder

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  mobService = app.get<MobService>(Types.MobService)
  mob1 = await testRunner.createMob()
  mob2 = await testRunner.createMob()
  mob3 = await testRunner.createMob()
})

describe("group action", () => {
  it("can add a follower to create a group", async () => {
    // given
    mobService.addFollow(mob1.get(), mob2.get())

    // when
    const response = await testRunner.invokeAction(RequestType.Group, `group ${mob2.getMobName()}`, mob2.get())

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you start a new group with ${mob2.getMobName()}.`)
    expect(response.getMessageToTarget())
      .toBe(`${mob1.getMobName()} starts a new group with you.`)
    expect(response.getMessageToObservers())
      .toBe(`${mob1.getMobName()} starts a new group with ${mob2.getMobName()}.`)
  })

  it("cannot add a mob to a group if they are not following", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Group, `group ${mob2.getMobName()}`, mob2.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe("They are not following you.")
  })

  it("can add multiple mobs to a group", async () => {
    // given
    mobService.addFollow(mob1.get(), mob2.get())
    mobService.addFollow(mob1.get(), mob3.get())
    mobService.addGroup([mob1.get(), mob2.get()])

    // when
    const response = await testRunner.invokeAction(RequestType.Group, `group ${mob3.getMobName()}`, mob3.get())

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you add ${mob3.getMobName()} to your group.`)
    expect(response.getMessageToTarget())
      .toBe(`${mob1.getMobName()} adds you to their group.`)
    expect(response.getMessageToObservers())
      .toBe(`${mob1.getMobName()} adds ${mob3.getMobName()} to their group.`)

    // and
    expect((mobService.getGroupForMob(mob1.get()) as Group).mobs).toHaveLength(3)
  })
})
