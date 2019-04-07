import {getConnection, initializeConnection} from "../../../support/db/connection"
import { getTestClient } from "../../../support/test/client"
import { MESSAGE_FAIL_PASSWORD_TOO_SHORT } from "../constants"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Password from "./password"
import PasswordConfirm from "./passwordConfirm"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

const mockAuthService = jest.fn()

describe("create player password", () => {
  it("should require at least three characters", async () => {
    // given
    const playerPassword = "aa"

    // setup
    const client = await getTestClient()
    const password = new Password(mockAuthService(), client.player)

    // when
    const response = await password.processRequest(new Request(client, playerPassword))

    // then
    expect(response.status).toBe(ResponseStatus.FAILED)
    expect(response.authStep).toBeInstanceOf(Password)
    expect(response.message).toBe(MESSAGE_FAIL_PASSWORD_TOO_SHORT)
  })

  it("should proceed to confirmation if the password has at least four characters long", async () => {
    // given
    const playerPassword = "fooo"

    // setup
    const client = await getTestClient()
    const password = new Password(mockAuthService(), client.player)

    // when
    const response = await password.processRequest(new Request(client, playerPassword))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(PasswordConfirm)
  })
})
