import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import InputContext from "../../request/context/inputContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import { Direction } from "../../room/constants"
import TestBuilder from "../../test/testBuilder"
import move from "./move"

describe("move", () => {
  it("should allow movement where rooms connect", async () => {
    // given
    const testBuilder = new TestBuilder()
    const source = testBuilder.withRoom().room
    const destination = testBuilder.withRoom(Direction.East).room
    const service = await testBuilder.getService()
    const mob = (await testBuilder.withPlayer()).player.sessionMob

    // when
    const response = await move(
      new CheckedRequest(new Request(mob, source, new InputContext(RequestType.East)), await Check.ok()),
      Direction.East,
      service)

    // then
    expect(response.status).toBe(ResponseStatus.Info)
    expect(destination.mobs).toHaveLength(1)
  })
})
