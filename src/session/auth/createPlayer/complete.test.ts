import { getTestClient } from "../../../test/client"
import Name from "../login/name"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Complete from "./complete"

describe("create player auth step: complete", () => {
  it("should proceed to the final step unconditionally", async () => {
    // given
    const client = await getTestClient()

    // when
    const response = await new Complete(client.player).processRequest(new Request(client, ""))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Name)
  })

  it("should persist the player", async () => {
    // given
    const client = await getTestClient()

    // expect
    expect(client.player.id).toBeUndefined()

    // when
    await new Complete(client.player).processRequest(new Request(client, ""))

    // then
    expect(client.player.id).not.toBeUndefined()
  })
})
