import { newAttributes, newHitroll, newStartingStats, newStartingVitals } from "../../../attributes/factory"
import { Mob } from "../../../mob/model/mob"
import { PlayerMob } from "../../../mob/model/playerMob"
import { Player } from "../../../player/model/player"
import AuthService from "../authService"
import AuthStep from "../authStep"
import { MESSAGE_NEW_MOB_CONFIRM, MESSAGE_YN_FAILED } from "../constants"
import Name from "../login/name"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"
import Race from "./race"

export default class NewMobConfirm extends PlayerAuthStep implements AuthStep {
  constructor(authService: AuthService, player: Player, public readonly name: string) {
    super(authService, player)
  }

  /* istanbul ignore next */
  public getStepMessage(): string {
    return MESSAGE_NEW_MOB_CONFIRM
  }

  public async processRequest(request: Request): Promise<Response> {
    if (request.didDeny()) {
      return request.ok(new Name(this.authService, this.player))
    } else if (request.didConfirm()) {
      const mob = await this.createMob()
      this.player.mobs.push(mob)
      this.player.sessionMob = mob
      return request.ok(new Race(this.authService, this.player))
    }

    return request.fail(this, MESSAGE_YN_FAILED)
  }

  private async createMob(): Promise<Mob> {
    const mob = new Mob()
    mob.vitals = newStartingVitals()
    mob.name = this.name
    mob.traits.isNpc = false
    mob.player = this.player
    mob.gold = 1000
    mob.attributes.push(newAttributes(
      newStartingVitals(),
      newStartingStats(),
      newHitroll(0, 0),
    ))
    mob.playerMob = new PlayerMob()

    return mob
  }
}
