import { getTestClient } from "../../test/client"
import Complete from "./complete"
import Request from "./request"
import { ResponseStatus } from "./responseStatus"

describe("final auth step: complete", () => {
  it("should be ok unconditionally, but not have any more steps to complete", async () => {
    // given
    const client = getTestClient()

    // when
    const response = await new Complete(client.player).processRequest(new Request(client, ""))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Complete)
  })
})
