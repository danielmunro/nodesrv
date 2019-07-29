import {inject, injectable} from "inversify"
import ActionService from "../../action/service/actionService"
import { Client } from "../../client/client"
import {Types} from "../../support/types"
import { Observer } from "./observer"

@injectable()
export class HandleClientRequests implements Observer {
  constructor(@inject(Types.ActionService) private readonly actionService: ActionService) {}

  public async notify(clients: Client[]): Promise<void> {
    clients
      .filter(client => client.canHandleRequests())
      .forEach(client => this.handleClientRequest(client))
  }

  private async handleClientRequest(client: Client) {
    const response = await this.actionService.handleRequest(client, client.getNextRequest())
    if (client.isLoggedIn()) {
      client.send(response.getPayload())
      client.sendMessage(client.player.prompt())
    }
  }
}
