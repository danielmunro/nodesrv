import { Client } from "./../../client/client"
import { readMessages } from "./../../social/chat"
import { Message } from "./../../social/message"
import { Observer } from "./observer"

function sendToClientIfNotSender(client: Client, message: Message): void {
  if (!client.isOwnMessage(message)) {
    client.send(message.getData())
  }
}

export class SocialBroadcaster implements Observer {
  public notify(clients: Client[]): void {
    readMessages().forEach((message) =>
      clients.forEach((client) =>
        sendToClientIfNotSender(client, message)))
  }
}
