import ItemTable from "../item/itemTable"
import { Item } from "../item/model/item"
import LocationService from "../mob/locationService"
import { Mob } from "../mob/model/mob"
import MobLocation from "../mob/model/mobLocation"
import { default as MobTable } from "../mob/table"
import ExitTable from "../room/exitTable"
import { Exit } from "../room/model/exit"
import { Room } from "../room/model/room"
import { default as RoomTable } from "../room/roomTable"
import Service from "./service"

export default class ServiceBuilder {
  public readonly locationService: LocationService = new LocationService([])

  constructor(
    private rooms: Room[] = [],
    private mobs: Mob[] = [],
    private items: Item[] = [],
    private exits: Exit[] = []) {}

  public addRoom(room: Room): void {
    this.rooms.push(room)
  }

  public addMob(mob: Mob): void {
    this.mobs.push(mob)
  }

  public addItem(item: Item): void {
    this.items.push(item)
  }

  public addExit(exit: Exit): void {
    this.exits.push(exit)
  }

  public addMobLocation(mobLocation: MobLocation) {
    this.locationService.addMobLocation(mobLocation)
  }

  public async createService(): Promise<Service> {
    return Service.new(
      this.locationService,
      RoomTable.new(this.rooms),
      new MobTable(this.mobs),
      new ItemTable(this.items),
      new ExitTable(this.locationService, this.exits),
    )
  }
}
