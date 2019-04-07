import * as uuid from "uuid"
import {getConnection, initializeConnection} from "../../../support/db/connection"
import TestBuilder from "../../../support/test/testBuilder"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Complete from "./complete"
import Password from "./password"
import PasswordConfirm from "./passwordConfirm"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

const mockAuthService = jest.fn()

describe("create player password confirm auth step", () => {
  it("should work with matching passwords", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const password = uuid.v4()
    const client = await testBuilder.withClient()

    // setup
    const passwordConfirm = new PasswordConfirm(mockAuthService(), client.player, password)

    // when
    const response = await passwordConfirm.processRequest(new Request(client, password))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Complete)
  })

  it("should reject mismatched passwords", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const password1 = uuid.v4()
    const password2 = uuid.v4()
    const client = await testBuilder.withClient()

    // setup
    const passwordConfirm = new PasswordConfirm(mockAuthService(), client.player, password1)

    // when
    const response = await passwordConfirm.processRequest(new Request(client, password2))

    // then
    expect(response.status).toBe(ResponseStatus.FAILED)
    expect(response.authStep).toBeInstanceOf(Password)
  })
})
