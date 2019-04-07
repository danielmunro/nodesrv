import {getConnection, initializeConnection} from "../../support/db/connection"
import { getTestClient } from "../../support/test/client"
import Complete from "./complete"
import Request from "./request"
import { ResponseStatus } from "./responseStatus"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("final auth step: complete", () => {
  it("should be ok unconditionally, but not have any more steps to complete", async () => {
    // given
    const client = await getTestClient()

    // when
    const response = await new Complete(client.player).processRequest(new Request(client, ""))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Complete)
  })
})
