// @ts-ignore
import * as stringify from "json-stringify-safe"
import { MobEntity } from "../mob/entity/mobEntity"
import { PlayerEntity } from "../player/entity/playerEntity"
import Request from "../request/request"
import { default as AuthRequest } from "../session/auth/request"
import SessionService from "../session/service/sessionService"
import Socket from "./socket"

export class Client {
  public player: PlayerEntity
  private requests: any = []

  constructor(
    public readonly session: SessionService,
    public readonly socket: Socket,
    public readonly ip: string) {}

  public hasRequests(): boolean {
    return this.requests.length > 0
  }

  public addRequest(request: Request | AuthRequest): void {
    this.requests.push(request)
  }

  public isLoggedIn(): boolean {
    return this.session.isLoggedIn()
  }

  public canHandleRequests(): boolean {
    if (!this.isLoggedIn()) {
      return this.hasRequests()
    }

    return this.hasRequests() && this.player.delay === 0
  }

  public getSessionMob(): MobEntity {
    return this.session.getMob()
  }

  public getNextRequest(): Request {
    return this.requests.shift()
  }

  public send(data: any): void {
    this.socket.send(stringify(data))
  }

  public sendMessage(message: string) {
    this.send({ message })
  }

  public tick(id: string, timestamp: Date) {
    this.send({ tick: { id, timestamp }})
  }
}
