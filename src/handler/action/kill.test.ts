import { Player } from "../../player/model/player"
import { createRequestArgs, Request } from "../../request/request"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { ATTACK_MOB, MOB_NOT_FOUND } from "../actions"
import { RequestType } from "../constants"
import kill from "./kill"

function useKillRequest(player: Player, input: string) {
  return kill(new Request(player, RequestType.Kill, createRequestArgs(input)))
}

describe("kill", () => {
  it("should not be able to kill a mob that isn't in the same room", async () => {
    const player = getTestPlayer()
    const target = getTestMob()
    expect.assertions(1)
    await useKillRequest(player, "kill " + target.name)
      .then((response) => expect(response.message).toBe(MOB_NOT_FOUND))
  })

  it("should be able to kill a mob in the same room", async () => {
    const player = getTestPlayer()
    const target = getTestMob()
    player.moveTo(target.room)
    expect.assertions(1)
    await useKillRequest(player, "kill " + target.name)
      .then((response) => expect(response.message).toBe(ATTACK_MOB))
  })
})
