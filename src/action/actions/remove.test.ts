import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import CheckComponent from "../check/checkComponent"
import { CheckType } from "../check/checkType"
import remove from "./remove"

describe("remove", () => {
  it("can remove an equipped item", async () => {
    const testBuilder = new TestBuilder()

    // given
    const playerBuilder = await testBuilder.withPlayer()
    const item = playerBuilder.equip().withHelmetEq()

    // when
    const response = await remove(
      testBuilder.createOkCheckedRequest(
        RequestType.Remove,
        `remove ${item.name}`,
        item,
        [new CheckComponent(CheckType.HasItem, item)]))

    // then
    expect(response.status).toBe(ResponseStatus.Info)
    expect(response.message).toContain("You remove")
  })
})
