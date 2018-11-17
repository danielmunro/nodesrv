import { Client } from "../../client/client"
import LocationService from "../../mob/locationService"
import { Message } from "../../social/message"
import { readPrivateMessages } from "../../social/privateBroadcast"
import { readMessages} from "../../social/publicBroadcast"
import { Observer } from "./observer"

function sendToClientIfNotSender(client: Client, message: Message): void {
  if (client.isLoggedIn() && !client.isOwnMessage(message)) {
    client.send(message.getData())
  }
}

export class SocialBroadcaster implements Observer {
  constructor(private readonly locationService: LocationService) {}

  public notify(clients: Client[]): void {
    readMessages().forEach(message =>
      clients.forEach(client =>
        sendToClientIfNotSender(client, message)))
    const privateMessages = readPrivateMessages()
    clients.forEach(client => this.evaluateForPrivateMessages(client, privateMessages))
  }

  private evaluateForPrivateMessages(client: Client, privateMessages) {
    if (!client.isLoggedIn()) {
      return
    }
    const location = this.locationService.getLocationForMob(client.getSessionMob())
    const messages = privateMessages[location.room.uuid]
    if (messages) {
      messages.forEach(message => sendToClientIfNotSender(client, message))
    }
  }
}
