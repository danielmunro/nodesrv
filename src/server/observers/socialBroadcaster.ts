import { Client } from "../../client/client"
import { Message } from "../../social/message"
import { readPrivateMessages } from "../../social/privateBroadcast"
import { readMessages} from "../../social/publicBroadcast"
import { Observer } from "./observer"

function sendToClientIfNotSender(client: Client, message: Message): void {
  if (client.isLoggedIn() && !client.isOwnMessage(message)) {
    client.send(message.getData())
  }
}

function evaluateForPrivateMessages(client: Client, privateMessages) {
  if (!client.isLoggedIn()) {
    return
  }
  const messages = privateMessages[client.player.sessionMob.room.uuid]
  if (messages) {
    messages.forEach(message => sendToClientIfNotSender(client, message))
  }
}

export class SocialBroadcaster implements Observer {
  public notify(clients: Client[]): void {
    readMessages().forEach(message =>
      clients.forEach(client =>
        sendToClientIfNotSender(client, message)))
    const privateMessages = readPrivateMessages()
    clients.forEach((client) => evaluateForPrivateMessages(client, privateMessages))
  }
}
