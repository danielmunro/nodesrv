import { Direction } from "../../room/constants"
import { getTestPlayer } from "../../test/player"
import move, { MESSAGE_DIRECTION_DOES_NOT_EXIST } from "./move"

describe("move", () => {
  it("should not allow movement where an exit does not exist", () => {
    expect.assertions(1)

    return move(getTestPlayer(), Direction.North)
      .then((response) => expect(response.message).toBe(MESSAGE_DIRECTION_DOES_NOT_EXIST))
  })
})
