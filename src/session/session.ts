import look from "../action/actions/look"
import { Client } from "../client/client"
import { Mob } from "../mob/model/mob"
import { Player } from "../player/model/player"
import { createRequestArgs, Request as ActionRequest } from "../request/request"
import { RequestType } from "../request/requestType"
import AuthStep from "./auth/authStep"
import Complete from "./auth/complete"
import { default as MobComplete } from "./auth/createMob/complete"
import { default as PlayerComplete } from "./auth/createPlayer/complete"
import Email from "./auth/login/email"
import Request from "./auth/request"
import { SessionStatus } from "./status"

export default class Session {
  private player: Player
  private mob: Mob
  private status: SessionStatus = SessionStatus.Initialized

  constructor(
    public readonly client: Client,
    private authStep: AuthStep = new Email()) {}

  public isLoggedIn(): boolean {
    return this.status === SessionStatus.LoggedIn
  }

  public async handleRequest(request: Request) {
    const response = await this.authStep.processRequest(request)
    this.authStep = response.authStep
    this.client.send({ message: response.message })
    this.client.send({ message: this.authStep.getStepMessage() })
    if (this.authStep instanceof MobComplete
      || this.authStep instanceof PlayerComplete || this.authStep instanceof Complete) {
      this.authStep = (await this.authStep.processRequest(request)).authStep
      if (this.authStep instanceof Complete) {
        return await this.login(this.authStep.player)
      }
      this.client.send({ message: this.authStep.getStepMessage() })
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

  public async login(player: Player) {
    this.mob = player.sessionMob
    this.player = player
    this.client.startRoom.addMob(this.mob)
    this.client.player = this.player
    this.status = SessionStatus.LoggedIn
    this.client.send({ player: this.player })
    this.client.send(await look(new ActionRequest(this.player, RequestType.Look, createRequestArgs("look"))))
  }
}
