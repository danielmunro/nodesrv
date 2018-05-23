import { RequestType } from "../../../handler/constants"
import { getPlayerRepository } from "../../../player/repository/player"
import { savePlayer } from "../../../player/service"
import { createRequestArgs, Request } from "../../../server/request/request"
import { getTestPlayer } from "../../../test/player"
import AuthStep from "../authStep"
import Email from "./email"
import NewPlayerConfirm from "./newPlayerConfirm"
import Password from "./password"

function processInput(input: string, player = getTestPlayer()): Promise<AuthStep> {
  return new Email().processRequest(
    new Request(player, RequestType.Noop, createRequestArgs(input)))
}

describe("login email auth step", () => {
  it("should disallow invalid email formats", async () => {
    expect(await processInput("poodlehat")).toBeInstanceOf(Email)
    expect(await processInput("foo@")).toBeInstanceOf(Email)
    expect(await processInput("a@b.c")).toBeInstanceOf(Email)
    expect(await processInput("foo@bar")).toBeInstanceOf(Email)
  })

  it("should allow valid email formats", async () => {
    expect(await processInput("foo@bar.com")).toBeInstanceOf(NewPlayerConfirm)
  })

  it("should ask for a password for an existing player", async () => {
    // given
    const email = "foo@bar.com"

    // setup
    const player = getTestPlayer()
    player.email = email
    await savePlayer(player)

    // expect
    expect(await processInput(email, player)).toBeInstanceOf(Password)

    // cleanup
    getPlayerRepository().then((repository) => repository.delete(player))
  })
})
