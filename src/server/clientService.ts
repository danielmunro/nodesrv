import {inject, injectable} from "inversify"
import Action from "../action/impl/action"
import {Client} from "../client/client"
import EventService from "../event/eventService"
import {Mob} from "../mob/model/mob"
import LocationService from "../mob/service/locationService"
import CreationService from "../session/auth/creationService"
import Email from "../session/auth/login/email"
import Session from "../session/session"
import {Types} from "../support/types"
import {Observer} from "./observers/observer"

@injectable()
export default class ClientService {
  constructor(
    @inject(Types.EventService) private readonly eventService: EventService,
    @inject(Types.CreationService) private readonly authService: CreationService,
    @inject(Types.LocationService) private readonly locationService: LocationService,
    @inject(Types.Actions) private readonly actions: Action[],
    private clients: Client[] = []) {}

  public createNewClient(ws: WebSocket, req: any) {
    const client = new Client(
      new Session(new Email(this.authService)),
      ws,
      req ? req.connection.remoteAddress : null,
      this.actions,
      this.locationService,
      this.eventService)
    this.add(client)
    return client
  }

  public add(client: Client) {
    this.clients.push(client)
  }

  public remove(client: Client) {
    this.clients = this.clients.filter(c => c !== client)
  }

  public getClientByMob(mob: Mob): Client | undefined {
    return this.clients.find((client: Client) => client.getSessionMob() === mob)
  }

  public getClientCount(): number {
    return this.clients.length
  }

  public notifyClients(observer: Observer) {
    observer.notify(this.clients)
  }

  public sendMessageToMob(mob: Mob, message: string) {
    const client = this.clients.find(c => c.getSessionMob() === mob)
    if (client) {
      client.sendMessage(message)
    }
  }

  public sendMessageInRoom(mob: Mob, message: string): void {
    const mobs = this.getRoomMobs(mob)
    const clients = this.clients.filter(c => mobs.includes(c.getSessionMob()) && c.getSessionMob() !== mob)
    clients.forEach(c => c.sendMessage(message))
  }

  public sendMessage(mob: Mob, message: string): void {
    this.clients.forEach(c => {
      if (c.getSessionMob() !== mob) {
        c.sendMessage(message)
      }
    })
  }

  private getRoomMobs(mob: Mob): Mob[] {
    const location = this.locationService.getLocationForMob(mob)
    return this.locationService.getMobsByRoom(location.room)
  }
}
