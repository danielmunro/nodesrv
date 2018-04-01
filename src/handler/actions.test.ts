import { Item } from "../item/model/item"
import { doWithItemOrElse } from "./actions"

describe("handlers", () => {
  it("should do with item or else", () => {
    const doNotUseCallback = jest.fn()
    const useCallback = jest.fn()
    expect.assertions(2)
    return Promise.all([
      doWithItemOrElse(
        null,
        doNotUseCallback,
        ""),
      doWithItemOrElse(
        new Item(),
        useCallback,
        ""),
      ])
    .then(() => {
      expect(doNotUseCallback).not.toBeCalled()
      expect(useCallback).toBeCalled()
    })
  })
})
