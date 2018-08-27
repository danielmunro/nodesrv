import { getPlayerRepository } from "../../../player/repository/player"
import { getTestClient } from "../../../test/client"
import Password from "../createPlayer/password"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Service from "../service"
import Email from "./email"
import NewPlayerConfirm from "./newPlayerConfirm"

const TEST_EMAIL = "foo@bar.com"

async function getNewPlayerConfirm(email: string) {
   return new NewPlayerConfirm(new Service(await getPlayerRepository()), email)
}

describe("new player confirm auth step", () => {
  it("should bounce back to email if the client selects 'n'", async () => {
    // given
    const email = TEST_EMAIL

    // setup
    const client = await getTestClient()
    const newPlayerConfirm = await getNewPlayerConfirm(email)

    // when
    const response = await newPlayerConfirm.processRequest(new Request(client, "n"))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Email)
  })

  it("should proceed to the next step (mob name) if 'y' selected", async () => {
    // given
    const email = TEST_EMAIL

    // setup
    const client = await getTestClient()
    const newPlayerConfirm = await getNewPlayerConfirm(email)

    // when
    const response = await newPlayerConfirm.processRequest(new Request(client, "y"))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Password)
  })

  it("should error out for any other input", async () => {
    // given
    const email = TEST_EMAIL
    const inputs = [
      "abc",
      null,
      "123",
      "yn",
    ]

    // setup
    const client = await getTestClient()
    const newPlayerConfirm = await getNewPlayerConfirm(email)

    // when/then
    return Promise.all([inputs.map(async (input) => {
      const response = await newPlayerConfirm.processRequest(new Request(client, input))

      expect(response.status).toBe(ResponseStatus.FAILED)
      expect(response.authStep).toBeInstanceOf(NewPlayerConfirm)
    })])
  })
})
