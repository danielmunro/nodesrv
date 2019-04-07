import {getConnection, initializeConnection} from "../../../support/db/connection"
import TestBuilder from "../../../support/test/testBuilder"
import { default as FinalComplete } from "../complete"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Complete from "./complete"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

const mockAuthService = jest.fn()

describe("create mob auth step: complete", () => {
  it("should proceed to the final step unconditionally", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const client = await testBuilder.withClient()

    // when
    const response = await new Complete(mockAuthService(), client.player).processRequest(new Request(client, ""))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(FinalComplete)
  })
})
