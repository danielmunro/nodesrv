import { Client } from "../../client/client"
import { MobEntity } from "../../mob/entity/mobEntity"
import { PlayerEntity } from "../../player/entity/playerEntity"
import AuthStep from "../auth/authStep/authStep"
import Complete from "../auth/authStep/complete"
import { default as MobComplete } from "../auth/authStep/createMob/complete"
import { default as PlayerComplete } from "../auth/authStep/createPlayer/complete"
import { default as AuthRequest } from "../auth/request"
import { SessionStatus } from "../enum/sessionStatus"

export default class SessionService {
  private player: PlayerEntity
  private mob: MobEntity
  private status: SessionStatus = SessionStatus.Initialized

  constructor(private authStep: AuthStep) {}

  public isLoggedIn(): boolean {
    return this.status === SessionStatus.LoggedIn
  }

  public async handleRequest(client: Client, request: AuthRequest) {
    const response = await this.authStep.processRequest(request)
    this.authStep = response.authStep
    client.send({ message: response.message })
    client.send({ message: this.authStep.getStepMessage() })
    if (this.isEndStep()) {
      await this.doEndStep(client, request)
    }
    return response
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

  public async login(client: Client, player: PlayerEntity): Promise<void> {
    this.mob = player.sessionMob
    this.player = player
    this.status = SessionStatus.LoggedIn
    client.player = player
  }

  private async doEndStep(client: Client, request: AuthRequest) {
    this.authStep = (await this.authStep.processRequest(request)).authStep
    if (this.isCompleteAuth()) {
      await this.login(client, (this.authStep as Complete).player)
      return
    }
  }

  private isEndStep() {
    return this.authStep instanceof MobComplete ||
      this.authStep instanceof PlayerComplete ||
      this.authStep instanceof Complete
  }

  private isCompleteAuth() {
    return this.authStep instanceof Complete
  }
}
