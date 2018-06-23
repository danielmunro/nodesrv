import { v4 } from "uuid"
import { savePlayer } from "../../../player/service"
import { getTestClient } from "../../../test/client"
import Request from "../request"
import Response from "../response"
import { ResponseStatus } from "../responseStatus"
import Email from "./email"
import NewPlayerConfirm from "./newPlayerConfirm"
import Password from "./password"

function processInput(input: string, client = getTestClient()): Promise<Response> {
  return new Email().processRequest(
    new Request(client, input))
}

describe("login email auth step", () => {
  it("should disallow invalid email formats", async () => {
    [
      "poodlehat",
      "foo@",
      "a@b.c",
      "foo@bar",
      "",
      null,
      "abc@123",
      "foo@bar.com.",
      "foo@barcom",
      "47",
    ].forEach(async (badInput) =>
      expect((await processInput(badInput)).status).toBe(ResponseStatus.FAILED))
  })

  it("should allow valid email formats", async () => {
    // given
    const email = "foo" + v4() + "@bar.com"

    // when
    const response = await processInput(email)

    // then
    expect(response.status).toBe(ResponseStatus.OK)
  })

  it("should ask for a password for an existing player", async () => {
    // given
    const email = "foo" + v4() + "@bar.com"

    // setup
    const client = getTestClient()
    client.player.email = email
    await savePlayer(client.player)

    // when
    const response = await processInput(email, client)

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Password)
  })

  it("should allow creating new players", async () => {
    // given
    const email = "foo" + v4() + "@bar.com"
    const client = getTestClient()

    // when
    const response = await processInput(email, client)

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(NewPlayerConfirm)
  })
})
