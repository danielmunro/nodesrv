import {createTestAppContainer} from "../../../app/testFactory"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import Name from "../login/name"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Complete from "./complete"

jest.mock("../../../player/service")
const mockAuthService = jest.fn()

describe("create player auth step: complete", () => {
  it("should proceed to the final step unconditionally", async () => {
    // given
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    const client = await testRunner.createLoggedInClient()

    // when
    const response = await new Complete(mockAuthService(), client.player).processRequest(new Request(client, ""))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Name)
  })
})
