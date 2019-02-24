import getActionTable from "../action/actionTable"
import {Client} from "../client/client"
import eventConsumerTable from "../event/eventConsumerTable"
import EventService from "../event/eventService"
import ItemService from "../item/itemService"
import ItemTable from "../item/itemTable"
import { Item } from "../item/model/item"
import { Fight } from "../mob/fight/fight"
import FightBuilder from "../mob/fight/fightBuilder"
import FightTable from "../mob/fight/fightTable"
import LocationService from "../mob/locationService"
import MobService from "../mob/mobService"
import { default as MobTable } from "../mob/mobTable"
import { Mob } from "../mob/model/mob"
import MobLocation from "../mob/model/mobLocation"
import { Exit } from "../room/model/exit"
import { Room } from "../room/model/room"
import { default as RoomTable } from "../room/roomTable"
import ClientService from "../server/clientService"
import {GameServer} from "../server/server"
import AuthService from "../session/auth/authService"
import {getSkillTable} from "../skill/skillTable"
import getSpellTable from "../spell/spellTable"
import ActionService from "./actionService"
import GameService from "./gameService"
import TimeService from "./timeService"

export default class ServiceBuilder {
  private time: number = 0
  private fights: Fight[] = []
  private locations: MobLocation[] = []
  private clients: Client[] = []
  private builtService: GameService

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
    if (this.builtService) {
      this.builtService.roomTable.add(room)
    }
  }

  public addClient(client: Client) {
    this.clients.push(client)
  }

  public addMob(mob: Mob): void {
    this.mobs.push(mob)
    if (this.builtService) {
      this.builtService.mobService.mobTemplateTable.add(mob)
    }
  }

  public addItem(item: Item): void {
    this.items.push(item)
    if (this.builtService) {
      this.builtService.itemService.add(item)
    }
  }

  public addExit(exit: Exit): void {
    this.exits.push(exit)
  }

  public addMobLocation(mobLocation: MobLocation) {
    this.locations.push(mobLocation)
  }

  public async createService(startRoom: Room): Promise<GameService> {
    if (this.builtService) {
      return this.builtService
    }
    const eventService = new EventService()
    const roomTable = RoomTable.new(this.rooms)
    const locationService = new LocationService(roomTable, eventService, this.locations)
    const itemService = new ItemService(new ItemTable(this.items), new ItemTable(this.items))
    const mobService = new MobService(
      new MobTable(this.mobs),
      new MobTable(this.mobs),
      new FightTable(this.fights),
      locationService)
    const timeService = new TimeService(this.time)
    const skillTable = getSkillTable(mobService, eventService)
    const spellTable = getSpellTable(mobService, eventService)
    this.builtService = new GameService(
      mobService,
      roomTable,
      itemService,
      eventService,
      new ActionService(
        getActionTable(mobService, itemService, timeService, eventService, spellTable),
        skillTable,
        spellTable),
      timeService)
    await this.attachEventConsumers(startRoom)
    return this.builtService
  }

  private async attachEventConsumers(room: Room) {
    const gameServer = new GameServer(
      null,
      room,
      new ClientService(
        this.builtService.eventService,
        new AuthService(jest.fn()(), this.builtService.mobService),
        this.builtService.mobService.locationService,
        this.builtService.getActions(),
        this.clients),
      this.builtService.eventService)
    const eventConsumers = await eventConsumerTable(
      this.builtService,
      gameServer,
      this.builtService.mobService,
      this.builtService.itemService,
      new FightBuilder(this.builtService.eventService, this.builtService.mobService.locationService))
    eventConsumers.forEach(eventConsumer => this.builtService.eventService.addConsumer(eventConsumer))
  }
}
