import { WebSocket } from "mock-socket"
import { Client } from "../client/client"
import { actions } from "../handler/actions"
import { getTestPlayer } from "./player"

export function getTestClient(player = getTestPlayer()): Client {
  return new Client(new WebSocket("ws://localhost:1111"), player, actions)
}
