import {createTestAppContainer} from "../../../app/testFactory"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {CreationMessages} from "../constants"
import { ResponseStatus } from "../enum/responseStatus"
import Request from "../request"
import Password from "./password"
import PasswordConfirm from "./passwordConfirm"

const mockAuthService = jest.fn()
let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("create player password", () => {
  it("should require at least three characters", async () => {
    // given
    const playerPassword = "aa"

    // setup
    const client = testRunner.createClient()
    const password = new Password(mockAuthService(), client.player)

    // when
    const response = await password.processRequest(new Request(client, playerPassword))

    // then
    expect(response.status).toBe(ResponseStatus.FAILED)
    expect(response.authStep).toBeInstanceOf(Password)
    expect(response.message).toBe(CreationMessages.Player.PasswordTooShort)
  })

  it("should proceed to confirmation if the password has at least four characters long", async () => {
    // given
    const playerPassword = "fooo"

    // setup
    const client = testRunner.createClient()
    const password = new Password(mockAuthService(), client.player)

    // when
    const response = await password.processRequest(new Request(client, playerPassword))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(PasswordConfirm)
  })
})
