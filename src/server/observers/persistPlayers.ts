import {inject, injectable} from "inversify"
import { Client } from "../../client/client"
import MobRepository from "../../mob/repository/mob"
import PlayerRepository from "../../player/repository/player"
import {Types} from "../../support/types"
import { Observer } from "./observer"

const timeLabel = "persist players"

@injectable()
export class PersistPlayers implements Observer {
  constructor(
    @inject(Types.PlayerRepository) private readonly playerRepository: PlayerRepository,
    @inject(Types.MobRepository) private readonly mobRepository: MobRepository) {}

  public async notify(clients: Client[]) {
    console.time(timeLabel)
    await this.playerRepository.save(clients.map(client => client.player))
    await this.mobRepository.save(clients.map(client => client.getSessionMob()))
    console.timeEnd(timeLabel)
  }
}
