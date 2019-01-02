import {Collection} from "../action/definition/collection"
import {Client} from "../client/client"
import EventService from "../event/eventService"
import LocationService from "../mob/locationService"
import {Mob} from "../mob/model/mob"
import {Room} from "../room/model/room"
import AuthService from "../session/auth/authService"
import Email from "../session/auth/login/email"
import Session from "../session/session"

export default class ClientService {
  private clients: Client[] = []

  constructor(
    private readonly eventService: EventService,
    private readonly authService: AuthService,
    private readonly locationService: LocationService,
    private readonly actionCollection: Collection) {}

  public createNewClient(ws: WebSocket, req) {
    const client = new Client(
      new Session(new Email(this.authService)),
      ws,
      req ? req.connection.remoteAddress : null,
      this.actionCollection,
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

  public getClientCount(): number {
    return this.clients.length
  }

  public getClients(): Client[] {
    return this.clients
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
