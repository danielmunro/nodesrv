import { Request } from "../../server/request/request"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { RequestType } from "../constants"
import { ATTACK_MOB, MOB_NOT_FOUND } from "./actions"
import kill from "./kill"

describe("kill", () => {
  it("should not be able to kill a mob that isn't in the same room", () => {
    const player = getTestPlayer()
    const target = getTestMob()

    expect.assertions(1)
    return kill(new Request(player, RequestType.Kill, {request: "kill " + target.name}))
      .then((response) => expect(response.message).toBe(MOB_NOT_FOUND))
  })

  it("should be able to kill a mob in the same room", () => {
    const player = getTestPlayer()
    const target = getTestMob()
    player.moveTo(target.room)

    expect.assertions(1)
    return kill(new Request(player, RequestType.Kill, {request: "kill " + target.name}))
      .then((response) => expect(response.message).toBe(ATTACK_MOB))
  })
})
