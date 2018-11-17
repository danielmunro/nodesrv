import ItemTable from "../item/itemTable"
import { Item } from "../item/model/item"
import LocationService from "../mob/locationService"
import { Mob } from "../mob/model/mob"
import MobLocation from "../mob/model/mobLocation"
import { default as MobTable } from "../mob/table"
import ExitTable from "../room/exitTable"
import { Exit } from "../room/model/exit"
import { Room } from "../room/model/room"
import { default as RoomTable } from "../room/table"
import Service from "./service"

export default class ServiceBuilder {
  private mobLocations: MobLocation[] = []

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
    this.mobLocations.push(mobLocation)
  }

  public async createService(): Promise<Service> {
    const locationService = new LocationService(this.mobLocations)
    return Service.new(
      locationService,
      RoomTable.new(this.rooms),
      new MobTable(this.mobs),
      new ItemTable(this.items),
      new ExitTable(locationService, this.exits),
    )
  }
}
