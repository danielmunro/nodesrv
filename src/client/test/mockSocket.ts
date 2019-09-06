import {WebSocket} from "mock-socket"
import Socket from "../socket"

export default function() {
  return new Socket(new WebSocket("ws://127.0.0.1"))
}
