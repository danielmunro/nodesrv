import EventService from "../event/eventService"
import ItemService from "../item/itemService"
import ItemTable from "../item/itemTable"
import { Item } from "../item/model/item"
import { Fight } from "../mob/fight/fight"
import FightTable from "../mob/fight/fightTable"
import LocationService from "../mob/locationService"
import MobService from "../mob/mobService"
import { default as MobTable } from "../mob/mobTable"
import { Mob } from "../mob/model/mob"
import MobLocation from "../mob/model/mobLocation"
import ExitTable from "../room/exitTable"
import { Exit } from "../room/model/exit"
import { Room } from "../room/model/room"
import { default as RoomTable } from "../room/roomTable"
import GameService from "./gameService"

export default class ServiceBuilder {
  private time: number = 0
  private fights: Fight[] = []
  private locations: MobLocation[] = []

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
    this.locations.push(mobLocation)
  }

  public async createService(eventService: EventService = new EventService()): Promise<GameService> {
    const roomTable = RoomTable.new(this.rooms)
    const locationService = new LocationService(roomTable, new ExitTable(this.exits), eventService, this.locations)
    return new GameService(
      new MobService(
        new MobTable(this.mobs),
        new MobTable(this.mobs),
        new FightTable(this.fights),
        locationService),
      roomTable,
      new ItemService(new ItemTable(this.items), new ItemTable(this.items)),
      eventService,
      this.time)
  }
}
