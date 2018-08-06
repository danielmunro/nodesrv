import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestPlayer } from "../../test/player"
import { actions } from "../actionCollection"
import { Definition } from "../definition/definition"

it("should be to handle gossiping", async () => {
  const request = new Request(getTestPlayer(), RequestType.Gossip, "gossip hello world")
  const handler = actions.getMatchingHandlerDefinitionForRequestType(
    request.requestType,
    new Definition(RequestType.Noop, jest.fn()))
  expect.assertions(1)

  await handler.handle(request)
    .then((response) => {
      expect(response.message).toContain("You gossip, 'hello world'")
    })
})
