import { Client } from "../../client/client"
import { Observer } from "./observer"
import { savePlayers } from "./../../player/model"
import { readMessages } from "./../../social/chat"
import { Message } from "./../../social/message"

function sendToClientIfNotSender(client: Client, message: Message): void {
  if (!client.isOwnMessage(message)) {
    client.sendMessage(message)
  }
}

export class SocialBroadcaster implements Observer {
  public notify(clients: Client[]): void {
    readMessages().forEach((message) =>
      clients.forEach((client) =>
        sendToClientIfNotSender(client, message)))
  }
}