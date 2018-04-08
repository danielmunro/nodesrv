import { Client } from "../../client/client"
import { getPlayerRepository } from "../../player/repository/player"
import { Observer } from "./observer"

export class PersistPlayers implements Observer {
  public notify(clients: Client[]): Promise<any> {
    return getPlayerRepository().then((playerRepository) =>
      Promise.all(clients.map((client) => playerRepository.save(client.player))))
  }
}
