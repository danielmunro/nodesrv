import { Client } from "../../client/client"
import MobRepository from "../../mob/repository/mob"
import PlayerRepository from "../../player/repository/player"
import { Observer } from "./observer"

const timeLabel = "persist players"

export class PersistPlayers implements Observer {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly mobRepository: MobRepository) {}

  public async notify(clients: Client[]) {
    console.time(timeLabel)
    await this.playerRepository.save(clients.map(client => client.player))
    await this.mobRepository.save(clients.map(client => client.getSessionMob()))
    console.timeEnd(timeLabel)
  }
}
