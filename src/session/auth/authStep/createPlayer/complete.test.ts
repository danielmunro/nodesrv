import {createTestAppContainer} from "../../../../app/factory/testFactory"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import { ResponseStatus } from "../../enum/responseStatus"
import Request from "../../request"
import Name from "../login/name"
import Complete from "./complete"

const mockAuthService = jest.fn(() => ({
  savePlayer: jest.fn(),
}))

describe("create player auth step: complete", () => {
  it("should proceed to the final step unconditionally", async () => {
    // given
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    const client = await testRunner.createLoggedInClient()

    // when
    const response = await new Complete(mockAuthService() as any, client.player)
      .processRequest(new Request(client, ""))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Name)
  })
})
