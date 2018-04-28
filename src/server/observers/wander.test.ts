import { Direction } from "../../room/constants"
import { newExit } from "../../room/factory"
import { persistAll } from "../../room/service"
import { getTestMob } from "../../test/mob"
import { getTestRoom } from "../../test/room"
import { Wander } from "./wander"

describe("wander", () => {
  it("should cause a mob to move", () => {
    const mob = getTestMob()
    const source = mob.room
    source.name = "room 1"
    const destination = getTestRoom()
    destination.name = "room 2"
    const exit = newExit(Direction.South, source, destination)
    const wander = new Wander(() => new Promise((resolve) => resolve([mob])))
    expect.assertions(1)

    return persistAll([source, destination], [exit])
      .then(() => wander.notify([])
        .then((result) => Promise.all(result)
          .then(() => expect(mob.room.name).toBe(destination.name))))
  })
})
