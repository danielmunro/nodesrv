import {WebSocket} from "mock-socket"
import Socket from "../socket"

jest.mock("../socket")

export default function() {
  return new Socket(new WebSocket("ws://127.0.0.1"))
}
