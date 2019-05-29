import AttributeBuilder from "../../../attributes/builder/attributeBuilder"
import {createMob, createPlayerMob} from "../../../mob/factory/mobFactory"
import { Mob } from "../../../mob/model/mob"
import { Player } from "../../../player/model/player"
import AuthStep from "../authStep"
import {CreationMessages} from "../constants"
import CreationService from "../creationService"
import Name from "../login/name"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"
import Race from "./race"

export default class NewMobConfirm extends PlayerAuthStep implements AuthStep {
  constructor(authService: CreationService, player: Player, public readonly name: string) {
    super(authService, player)
  }

  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.Mob.Confirm
  }

  public async processRequest(request: Request): Promise<Response> {
    if (request.didDeny()) {
      return request.ok(new Name(this.creationService, this.player))
    } else if (request.didConfirm()) {
      const mob = await this.createMob()
      this.player.mobs.push(mob)
      this.player.sessionMob = mob
      return request.ok(new Race(this.creationService, this.player))
    }

    return request.fail(this, CreationMessages.All.ConfirmFailed)
  }

  private async createMob(): Promise<Mob> {
    const mob = createMob()
    mob.hp = 20
    mob.mana = 100
    mob.mv = 100
    mob.name = this.name
    mob.traits.isNpc = false
    mob.player = this.player
    mob.gold = 1000
    mob.attributes.push(new AttributeBuilder()
      .setVitals(20, 100, 100)
      .setStats(15, 15, 15, 15, 15, 15)
      .build())
    mob.playerMob = createPlayerMob()
    return mob
  }
}
