import { v4 } from "uuid"
import {createTestAppContainer} from "../../../app/testFactory"
import {Client} from "../../../client/client"
import {getTestPlayer} from "../../../support/test/player"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import AuthService from "../authService"
import Request from "../request"
import Response from "../response"
import { ResponseStatus } from "../responseStatus"
import Email from "./email"
import NewPlayerConfirm from "./newPlayerConfirm"
import Password from "./password"

const mockRepository = jest.fn(() => ({
  findOneByEmail: () => getTestPlayer(),
}))

const mockRepositoryWithNoResults = jest.fn(() => ({
  findOneByEmail: () => null,
}))

async function processInput(input: string, client: Client): Promise<Response> {
  return new Email(new AuthService(mockRepository(), null)).processRequest(
    new Request(client, input))
}

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

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
    ].forEach(async (badInput: any) =>
      expect((await processInput(badInput, testRunner.createClient())).status).toBe(ResponseStatus.FAILED))
  })

  it("should allow valid email formats", async () => {
    // given
    const email = "foo" + v4() + "@bar.com"

    // when
    const response = await processInput(email, testRunner.createClient())

    // then
    expect(response.status).toBe(ResponseStatus.OK)
  }, 10000)

  it("should ask for a password for an existing player", async () => {
    // given
    const email = "foo" + v4() + "@bar.com"

    // setup
    const client = await testRunner.createLoggedInClient()
    client.player.email = email

    // when
    const response = await processInput(email, client)

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Password)
  })

  it("should allow creating new players", async () => {
    // given
    const email = "foo" + v4() + "@bar.com"
    const client = testRunner.createClient()

    // when
    const response = await new Email(new AuthService(mockRepositoryWithNoResults(), null))
      .processRequest(new Request(client, email))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(NewPlayerConfirm)
  })
})
