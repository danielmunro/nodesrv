import { v4 } from "uuid"
import { getPlayerRepository } from "../../../player/repository/player"
import { savePlayer } from "../../../player/service"
import {getConnection, initializeConnection} from "../../../support/db/connection"
import { getTestClient } from "../../../test/client"
import AuthService from "../authService"
import Request from "../request"
import Response from "../response"
import { ResponseStatus } from "../responseStatus"
import Email from "./email"
import NewPlayerConfirm from "./newPlayerConfirm"
import Password from "./password"

async function processInput(input: string, client = null): Promise<Response> {
  if (!client) {
    client = await getTestClient()
  }
  return new Email(new AuthService(await getPlayerRepository(), null)).processRequest(
    new Request(client, input))
}

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

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
  }, 10000)

  it("should ask for a password for an existing player", async () => {
    // given
    const email = "foo" + v4() + "@bar.com"

    // setup
    const client = await getTestClient()
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
    const client = await getTestClient()

    // when
    const response = await processInput(email, client)

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(NewPlayerConfirm)
  })
})
