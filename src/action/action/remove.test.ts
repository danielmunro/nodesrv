import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import {Action} from "../action"

let testBuilder: TestBuilder
let actionDefinition: Action

beforeEach(() => {
  testBuilder = new TestBuilder()
})

describe("remove", () => {
  it("can remove an equipped item", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer()
    const item = playerBuilder.equip().withHelmetEq()
    actionDefinition = await testBuilder.getActionDefinition(RequestType.Remove)

    // when
    const response = await actionDefinition.handle(
      testBuilder.createRequest(
        RequestType.Remove,
        `remove ${item.name}`,
        item))

    // then
    expect(response.status).toBe(ResponseStatus.Info)
    expect(response.message.getMessageToRequestCreator()).toContain("You remove")
  })
})
