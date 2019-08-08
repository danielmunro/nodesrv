import {createTestAppContainer} from "../../../app/factory/testFactory"
import MobService from "../../../mob/service/mobService"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
let mobService: MobService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  mobService = app.get<MobService>(Types.MobService)
})

describe("follow action", () => {
  it("sanity check", async () => {
    // given
    const follower = await testRunner.createMob()
    const target = await testRunner.createMob()

    // when
    const response = await testRunner.invokeAction(RequestType.Follow, `follow '${target.getMobName()}'`)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you begin following ${target.getMobName()}.`)
    expect(response.message.getMessageToTarget())
      .toBe(`${follower.getMobName()} begins following you.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${follower.getMobName()} begins following ${target.getMobName()}.`)
  })

  it("registers in the mob service", async () => {
    // given
    const mob = (await testRunner.createMob()).get()
    const target = await testRunner.createMob()

    // when
    await testRunner.invokeAction(RequestType.Follow, `follow '${target.getMobName()}'`)

    // then
    expect(mobService.getFollowers(mob)).toHaveLength(1)
  })
})
