import { getTestPlayer } from "../test/player"
import { savePlayers } from "./model"

describe("player models", () => {
  it("should save and hydrate with the same values", () => {
    const players = [
      getTestPlayer(),
      getTestPlayer(),
      getTestPlayer(),
    ]
    expect.assertions(1)
    return savePlayers(players)
      .then((rows) => expect(
          rows.map((row) => {delete row.id; return row}),
        ).toEqual(
          players.map((player) => player.getModel())))
  })
})
