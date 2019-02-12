import {RequestType} from "../../../request/requestType"
import TestBuilder from "../../../test/testBuilder"

describe("help action", () => {
  it("describes cast action", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const action = await testBuilder.getActionDefinition(RequestType.Help)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Help, "help cast"))

    // then
    expect(response.message.getMessageToRequestCreator())
      .toBe("syntax: cast {spell} {target}")
  })

  it("describes buy action", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const action = await testBuilder.getActionDefinition(RequestType.Help)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Help, "help buy"))

    // then
    expect(response.message.getMessageToRequestCreator())
      .toBe("syntax: buy {item with room mob}")
  })
})
