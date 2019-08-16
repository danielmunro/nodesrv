// @ts-ignore
import stringify from "json-stringify-safe"
import Request from "../messageExchange/request"
import { MobEntity } from "../mob/entity/mobEntity"
import { PlayerEntity } from "../player/entity/playerEntity"
import SessionService from "../session/service/sessionService"
import Maybe from "../support/functional/maybe/maybe"
import Socket from "./socket"

export class Client {
  public player: PlayerEntity
  private requests: Request[] = []

  constructor(
    public readonly session: SessionService,
    public readonly socket: Socket,
    public readonly ip: string) {}

  public hasRequests(): boolean {
    return this.requests.length > 0
  }

  public addRequest(request: Request): void {
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
    return new Maybe<Request>(this.requests.shift())
      .or(() => {
        throw new Error("No available requests")
      })
      .get()
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
