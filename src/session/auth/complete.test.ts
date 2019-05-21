import {createTestAppContainer} from "../../app/factory/testFactory"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import Complete from "./complete"
import { ResponseStatus } from "./enum/responseStatus"
import Request from "./request"

describe("final auth step: complete", () => {
  it("should be ok unconditionally, but not have any more steps to complete", async () => {
    // given
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    const client = await testRunner.createLoggedInClient()

    // when
    const response = await new Complete(jest.fn()(), client.player).processRequest(new Request(client, ""))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Complete)
  })
})
