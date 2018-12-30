import { Client } from "../../client/client"
import PlayerRepository from "../../player/repository/player"
import { Observer } from "./observer"

export class PersistPlayers implements Observer {
  constructor(private readonly playerRepository: PlayerRepository) {}

  public notify(clients: Client[]): Promise<any> {
    return this.playerRepository.save(clients.map(client => client.player))
  }
}
