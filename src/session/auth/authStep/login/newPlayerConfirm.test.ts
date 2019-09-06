import {createTestAppContainer} from "../../../../app/factory/testFactory"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import { ResponseStatus } from "../../enum/responseStatus"
import Request from "../../request"
import CreationService from "../../service/creationService"
import Password from "../createPlayer/password"
import Email from "./email"
import NewPlayerConfirm from "./newPlayerConfirm"

const TEST_EMAIL = "foo@bar.com"

async function getNewPlayerConfirm(email: string) {
  // @ts-ignore
  return new NewPlayerConfirm(new CreationService(jest.fn()(), null), email)
}

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("new player confirm auth step", () => {
  it("should bounce back to email if the client selects 'n'", async () => {
    // given
    const email = TEST_EMAIL

    // setup
    const client = testRunner.createClient()
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
    const client = testRunner.createClient()
    const newPlayerConfirm = await getNewPlayerConfirm(email)

    // when
    const response = await newPlayerConfirm.processRequest(new Request(client, "y"))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Password)
  })

  it.each([
    "abc",
    "123",
    "yn",
  ])("errors out for input: %s", async (input: string) => {
    // given
    const client = await testRunner.createLoggedInClient()

    // setup
    const newPlayerConfirm = await getNewPlayerConfirm(TEST_EMAIL)

    // when
    const response = await newPlayerConfirm.processRequest(new Request(client, input))

    // then
    expect(response.status).toBe(ResponseStatus.FAILED)
    expect(response.authStep).toBeInstanceOf(NewPlayerConfirm)
  })
})
