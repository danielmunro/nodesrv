// @ts-ignore
import stringify from "json-stringify-safe"
import Request from "../messageExchange/request"
import { MobEntity } from "../mob/entity/mobEntity"
import { PlayerEntity } from "../player/entity/playerEntity"
import AuthRequest from "../session/auth/request"
import Session from "../session/session"
import Maybe from "../support/functional/maybe/maybe"
import Socket from "./socket"

type Requests = Array<Request | AuthRequest>

export class Client {
  public player: PlayerEntity
  private requests: Requests = []

  constructor(
    public readonly session: Session,
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
    return new Maybe<Request>(this.requests.shift())
      .or(() => {
        throw new Error("No available requests")
      })
      .get()
  }

  public send(data: object): void {
    this.socket.send(stringify(data))
  }

  public sendMessage(message: string) {
    this.send({ message })
  }

  public tick(id: string, timestamp: Date) {
    this.send({ tick: { id, timestamp }})
  }
}
