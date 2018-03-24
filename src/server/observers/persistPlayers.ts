import { Connection } from "typeorm"
import { Client } from "../../client/client"
import { getConnection } from "../../db/connection"
import { getPlayerRepository } from "../../player/repository/player"
import { Observer } from "./observer"

export class PersistPlayers implements Observer {
  public notify(clients: Client[]): void {
    getPlayerRepository().then((playerRepository) =>
      clients.forEach((client) => playerRepository.save(client.getPlayer())))
  }
}
