import { WebSocket } from "mock-socket"
import { MessageHandler } from "./messageHandler"
import { Player } from "../../player/player"
import { Client } from "../../client/client"
import { Handler } from "./constants";

test("basic failure mode where there is no handler for the message", () => {
  const handler = new MessageHandler(
    new Player(new Client(new WebSocket('ws://localhost:1111'))),
    Handler.Noop
  )
  handler.applyHandlers(
    [],
    (result) => {
      fail("successfully applied a handler to a request without handlers")
    },
    () => {}
  )
})