import {Collection} from "../action/definition/collection"
import {Client} from "../client/client"
import LocationService from "../mob/locationService"
import {Mob} from "../mob/model/mob"

export default class ClientService {
  private clients: Client[] = []

  constructor(
    private readonly locationService: LocationService,
    private readonly actionCollection: Collection) {}

  public createNewClient() {
    // return new Client(
    //   new Session(new Email(this.authService), this.locationService),
    //   ws,
    //   req ? req.connection.remoteAddress : null,
    //   this.actionCollection,
    //   this.service,
    //   this.startRoom,
    //   this.locationService,
    //   this.eventService)
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
