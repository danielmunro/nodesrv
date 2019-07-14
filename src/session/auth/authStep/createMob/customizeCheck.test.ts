import CustomizeCheck from "./customizeCheck"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import CreationService from "../../service/creationService"
import {Types} from "../../../../support/types"
import TestRunner from "../../../../support/test/testRunner"
import {CreationMessages} from "../../constants"
import Request from "../../request"
import {Client} from "../../../../client/client"
import Complete from "./complete"
import CustomizePrompt from "./customizePrompt"

let customizeCheck: CustomizeCheck
let client: Client

beforeEach(async () => {
  const app = await createTestAppContainer()
  const creationService = app.get<CreationService>(Types.CreationService)
  const testRunner = app.get<TestRunner>(Types.TestRunner)
  client = testRunner.createClient()
  client.player = testRunner.createPlayer().get()
  customizeCheck = new CustomizeCheck(creationService, client.player)
})

describe("customize check session auth step", () => {
  it("has an appropriate step message", () => {
    // expect
    expect(customizeCheck.getStepMessage()).toBe(CreationMessages.Mob.CustomizeCheck)
  })

  it ("proceeds to complete when customization is denied", async () => {
    // when
    const response = await customizeCheck.processRequest(new Request(client, "n"))

    // then
    expect(response.authStep).toBeInstanceOf(Complete)
  })

  it ("proceeds to specialization when customization is denied", async () => {
    // when
    const response = await customizeCheck.processRequest(new Request(client, "y"))

    // then
    expect(response.authStep).toBeInstanceOf(CustomizePrompt)
  })

  it ("restarts the auth step if a bad input is provided", async () => {
    // when
    const response = await customizeCheck.processRequest(new Request(client, "foo"))

    // then
    expect(response.authStep).toBeInstanceOf(CustomizeCheck)
  })
})
