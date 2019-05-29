import {createTestAppContainer} from "../../../app/factory/testFactory"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import { ResponseStatus } from "../enum/responseStatus"
import Name from "../login/name"
import Request from "../request"
import NewMobConfirm from "./newMobConfirm"
import Race from "./race"

const mockAuthService = jest.fn()
let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("new mob confirm auth step", () => {
  it("should bounce back to mob name if the client selects 'n'", async () => {
    // given
    const client = testRunner.createClient()

    // setup
    const newMobConfirm = new NewMobConfirm(mockAuthService(), client.player, "foo")

    // when
    const response = await newMobConfirm.processRequest(new Request(client, "n"))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Name)
  })

  it("should proceed to the next step (raceType selection) if 'y' selected", async () => {
    // given
    const client = await testRunner.createLoggedInClient()

    // setup
    const newMobConfirm = new NewMobConfirm(mockAuthService(), client.player, "foo")

    // when
    const response = await newMobConfirm.processRequest(new Request(client, "y"))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Race)
  })

  it("generates with correct starting attributes", async () => {
    // setup
    const client = await testRunner.createLoggedInClient()
    const newMobConfirm = new NewMobConfirm(mockAuthService(), client.player, "foo")

    // when
    await newMobConfirm.processRequest(new Request(client, "y"))

    // then
    const attributes = newMobConfirm.player.sessionMob.attribute().combine()
    expect(attributes.hp).toBe(20)
    expect(attributes.mana).toBe(100)
    expect(attributes.mv).toBe(100)

    // and
    const mob = newMobConfirm.player.sessionMob
    expect(mob.hp).toBe(20)
    expect(mob.mana).toBe(100)
    expect(mob.mv).toBe(100)
  })

  it("should error out for any other input", async () => {
    // given
    const client = await testRunner.createLoggedInClient()

    // setup
    const newMobConfirm = new NewMobConfirm(mockAuthService(), client.player, "foo")

    // when
    const inputs = [
      "abc",
      null,
      "123",
      "yn",
    ]

    // then
    return Promise.all([inputs.map(async (input) => {
      const response = await newMobConfirm.processRequest(new Request(client, input as string))

      expect(response.status).toBe(ResponseStatus.FAILED)
      expect(response.authStep).toBeInstanceOf(NewMobConfirm)
    })])
  })
})
