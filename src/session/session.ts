import { Client } from "../client/client"
import { newMobLocation } from "../mob/factory"
import LocationService from "../mob/locationService"
import { Mob } from "../mob/model/mob"
import { Player } from "../player/model/player"
import AuthStep from "./auth/authStep"
import Complete from "./auth/complete"
import { default as MobComplete } from "./auth/createMob/complete"
import { default as PlayerComplete } from "./auth/createPlayer/complete"
import { default as AuthRequest } from "./auth/request"
import { SessionStatus } from "./status"

export default class Session {
  private player: Player
  private mob: Mob
  private status: SessionStatus = SessionStatus.Initialized
  private isMobCreated: boolean

  constructor(
    private authStep: AuthStep,
    private readonly locationService: LocationService) {}

  public isLoggedIn(): boolean {
    return this.status === SessionStatus.LoggedIn
  }

  public async handleRequest(client: Client, request: AuthRequest) {
    const response = await this.authStep.processRequest(request)
    this.authStep = response.authStep
    client.send({ message: response.message })
    client.send({ message: this.authStep.getStepMessage() })
    if (this.authStep instanceof MobComplete) {
      this.isMobCreated = true
    }
    if (this.authStep instanceof MobComplete
      || this.authStep instanceof PlayerComplete || this.authStep instanceof Complete) {
      this.authStep = (await this.authStep.processRequest(request)).authStep
      if (this.authStep instanceof Complete) {
        await this.login(client, this.authStep.player)
        return
      }
      client.send({ message: this.authStep.getStepMessage() })
    }
  }

  public getAuthStepMessage(): string {
    return this.authStep.getStepMessage()
  }

  public getMob() {
    return this.mob
  }

  public getPlayer() {
    return this.player
  }

  public getIsMobCreated(): boolean {
    return this.isMobCreated
  }

  public async login(client: Client, player: Player): Promise<void> {
    this.mob = player.sessionMob
    this.player = player
    this.locationService.addMobLocation(newMobLocation(this.mob, client.getStartRoom()))
    this.status = SessionStatus.LoggedIn
    client.player = player
  }
}
