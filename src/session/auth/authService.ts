import MobService from "../../mob/mobService"
import { Player } from "../../player/model/player"
import PlayerRepository from "../../player/repository/player"

export default class AuthService {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly mobService: MobService) {}

  public getOnePlayer(email: string): Promise<Player> {
    return this.playerRepository.findOneByEmail(email)
  }

  public findOnePlayerMob(name: string) {
    return this.mobService.mobTemplateTable.find(m => m.name === name && !m.traits.isNpc)
  }
}
