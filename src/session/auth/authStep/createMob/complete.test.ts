import {createTestAppContainer} from "../../../../app/factory/testFactory"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import { ResponseStatus } from "../../enum/responseStatus"
import Request from "../../request"
import CreationService from "../../service/creationService"
import { default as FinalComplete } from "../complete"
import Complete from "./complete"

describe("create mob auth step: complete", () => {
  it("should proceed to the final step unconditionally", async () => {
    // setup
    const app = await createTestAppContainer()
    const testRunner = app.get<TestRunner>(Types.TestRunner)
    const creationService = app.get<CreationService>(Types.CreationService)

    // given
    const client = testRunner.createClient()
    client.player = testRunner.createPlayer().get()
    client.player.sessionMob = testRunner.createMob().get()

    // when
    const response = await new Complete(creationService, client.player).processRequest(new Request(client, ""))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(FinalComplete)
  })
})
