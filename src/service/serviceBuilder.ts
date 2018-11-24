import ItemTable from "../item/itemTable"
import { Item } from "../item/model/item"
import { Fight } from "../mob/fight/fight"
import FightTable from "../mob/fight/fightTable"
import LocationService from "../mob/locationService"
import MobService from "../mob/mobService"
import { default as MobTable } from "../mob/mobTable"
import { Mob } from "../mob/model/mob"
import MobLocation from "../mob/model/mobLocation"
import { getMobRepository } from "../mob/repository/mob"
import ExitTable from "../room/exitTable"
import { Exit } from "../room/model/exit"
import { Room } from "../room/model/room"
import { default as RoomTable } from "../room/roomTable"
import Service from "./service"

export default class ServiceBuilder {
  public readonly locationService: LocationService = new LocationService([])
  private time: number = 0
  private fights: Fight[] = []

  constructor(
    private rooms: Room[] = [],
    private mobs: Mob[] = [],
    private items: Item[] = [],
    private exits: Exit[] = []) {}

  public setTime(time: number) {
    this.time = time
  }

  public addFight(fight: Fight): void {
    this.fights.push(fight)
  }

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
      new MobService(
        new MobTable(this.mobs),
        await getMobRepository(),
        new FightTable(this.fights),
        this.locationService),
      RoomTable.new(this.rooms),
      new ItemTable(this.items),
      new ExitTable(this.locationService, this.exits),
      this.time)
  }
}
