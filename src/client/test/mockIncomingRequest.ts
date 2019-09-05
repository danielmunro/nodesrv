import {IncomingMessage} from "http"

const incomingMessage = jest.fn(() => ({
  connection: {},
}))

export default function(): IncomingMessage {
  return incomingMessage() as any
}
