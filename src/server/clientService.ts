import {Client} from "../client/client"
import LocationService from "../mob/locationService"
import {Mob} from "../mob/model/mob"

export default class ClientService {
  private clients: Client[] = []

  constructor(private readonly locationService: LocationService) {}

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

  public sendMessageInRoom(mob: Mob, message: string): void {
    const mobs = this.getRoomMobs(mob)
    const clients = this.clients.filter(c => mobs.includes(c.getSessionMob()))
    clients.forEach(c => c.sendMessage(message))
  }

  private getRoomMobs(mob: Mob): Mob[] {
    const location = this.locationService.getLocationForMob(mob)
    return this.locationService.getMobsByRoom(location.room)
  }
}
