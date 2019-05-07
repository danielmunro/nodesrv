import {createTestAppContainer} from "../../../inversify.config"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import { default as FinalComplete } from "../complete"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Complete from "./complete"

const mockAuthService = jest.fn()

describe("create mob auth step: complete", () => {
  it("should proceed to the final step unconditionally", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)

    // given
    const client = testRunner.createClient()

    // when
    const response = await new Complete(mockAuthService(), client.player).processRequest(new Request(client, ""))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(FinalComplete)
  })
})
