import {createTestAppContainer} from "../../../app/factory/testFactory"
import hash from "../../../player/password/hash"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import { ResponseStatus } from "../enum/responseStatus"
import Request from "../request"
import Name from "./name"
import Password from "./password"

let testRunner: TestRunner
const mockAuthService = jest.fn()

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("password login auth step", () => {
  it("should be able to login in", async () => {
    // setup
    const client = await testRunner.createLoggedInClient()
    const password = new Password(mockAuthService(), client.player)

    // given
    const playerPassword = "s3crets"
    client.player.password = hash(playerPassword)

    // when
    const response = await password.processRequest(new Request(client, playerPassword))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Name)
  })

  it("should fail login with the wrong password", async () => {
    // setup
    const client = await testRunner.createLoggedInClient()
    const password = new Password(mockAuthService(), client.player)

    // given
    const playerPassword = "s3crets"
    const input = "notsecret"
    client.player.password = hash(playerPassword)

    // when
    const response = await password.processRequest(new Request(client, input))

    // then
    expect(response.status).toBe(ResponseStatus.FAILED)
    expect(response.authStep).toBeInstanceOf(Password)
  })
})
