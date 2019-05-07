import {inject, injectable} from "inversify"
import "reflect-metadata"
import MobService from "../../mob/mobService"
import {Mob} from "../../mob/model/mob"
import { Player } from "../../player/model/player"
import PlayerRepository from "../../player/repository/player"
import {Types} from "../../support/types"

@injectable()
export default class AuthService {
  constructor(
    @inject(Types.PlayerRepository) private readonly playerRepository: PlayerRepository,
    @inject(Types.MobService) private readonly mobService: MobService) {}

  public getOnePlayer(email: string): Promise<Player> {
    return this.playerRepository.findOneByEmail(email)
  }

  public findOnePlayerMob(name: string) {
    return this.mobService.mobTemplateTable.find((m: Mob) => m.name === name && !m.traits.isNpc)
  }
}
