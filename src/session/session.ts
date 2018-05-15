import { Client } from "../client/client"
import look from "../handler/action/look"
import { RequestType } from "../handler/constants"
import { Mob } from "../mob/model/mob"
import { Player } from "../player/model/player"
import { savePlayer } from "../player/service"
import { createRequestArgs, Request } from "../server/request/request"
import AuthStep from "./auth/authStep"
import Complete from "./auth/complete"
import Name from "./auth/name"
import { CreateMobStepStatus } from "./createMobStepStatus"
import { SessionStatus } from "./status"

export default class Session {
  public readonly client: Client
  private player: Player
  private mob: Mob
  private status: SessionStatus = SessionStatus.Initialized
  private createMobStepStatus: CreateMobStepStatus = CreateMobStepStatus.Name
  private authStep: AuthStep = new Name()

  constructor(client: Client) {
    this.client = client
  }

  public isLoggedIn(): boolean {
    return this.status === SessionStatus.LoggedIn
  }

  public async handleRequest(request: Request) {
    this.authStep = await this.authStep.processRequest(request)
    if (this.authStep instanceof Complete) {
      this.status = SessionStatus.LoggedIn
      this.mob = this.authStep.mob
      this.client.startRoom.addMob(this.mob)
      this.player = new Player()
      this.player.sessionMob = this.mob
      this.player.mobs.push(this.mob)
      savePlayer(this.player)
      this.client.send({ player: this.player })
      this.client.send(await look(new Request(this.player, RequestType.Look, createRequestArgs("look"))))
      return
    }

    this.client.send({ message: this.authStep.getStepMessage() })
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
}
