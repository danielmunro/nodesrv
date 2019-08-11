import {createTestAppContainer} from "../../../app/factory/testFactory"
import MobService from "../../../mob/service/mobService"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"

let testRunner: TestRunner
let mobService: MobService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  mobService = app.get<MobService>(Types.MobService)
})

describe("no follow action", () => {
  it("mobs default to followable", async () => {
    // given
    const mob = (await testRunner.createMob()).get()

    // expect
    expect(mob.allowFollow).toBeTruthy()
  })

  it("can be toggled off", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.NoFollow)

    // then
    expect(response.getMessageToRequestCreator()).toBe("you are no longer accepting followers.")
  })

  it("can be toggled on", async () => {
    // setup
    const mob = (await testRunner.createMob()).get()

    // given
    mob.allowFollow = false

    // when
    const response = await testRunner.invokeAction(RequestType.NoFollow)

    // then
    expect(response.getMessageToRequestCreator()).toBe("you are accepting followers.")
  })

  it("is respected", async () => {
    // setup
    const mob1 = (await testRunner.createMob()).get()
    const mob2 = (await testRunner.createMob()).get()

    // given
    mob1.allowFollow = false

    // when
    const response = await testRunner.invokeActionAs(mob2, RequestType.Follow, `follow ${mob1.name}`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Follow.NotAllowed)
  })

  it("currently following mobs stop following", async () => {
    // setup
    const mob1 = (await testRunner.createMob()).get()
    const mob2 = (await testRunner.createMob()).get()
    const mob3 = (await testRunner.createMob()).get()

    // given
    mobService.addFollow(mob1, mob2)
    mobService.addFollow(mob1, mob3)

    // when
    await testRunner.invokeAction(RequestType.NoFollow)

    // then
    expect(mobService.getFollowers(mob1)).toHaveLength(0)
  })

  it("also breaks a group when nofollowed", async () => {
    // setup
    const mob1 = (await testRunner.createMob()).get()
    const mob2 = (await testRunner.createMob()).get()

    // given
    mobService.addFollow(mob1, mob2)
    mobService.addGroup([mob1, mob2])

    // when
    await testRunner.invokeAction(RequestType.NoFollow)

    // then
    expect(mobService.getFollowers(mob1)).toHaveLength(0)
    expect(mobService.getGroupForMob(mob1)).toBeUndefined()
  })
})
