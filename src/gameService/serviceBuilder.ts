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
import WeatherService from "../region/weatherService"
import ExitTable from "../room/exitTable"
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
import StateService from "./stateService"
import TimeService from "./timeService"

export default class ServiceBuilder {
  private time: number = 12
  private fights: Fight[] = []
  private locations: MobLocation[] = []
  private clients: Client[] = []
  private builtService: GameService
  private rooms: Room[] = []
  private mobs: Mob[] = []
  private items: Item[] = []
  private exits: Exit[] = []
  private readonly itemService: ItemService

  constructor(
    private readonly eventService: EventService) {
    this.itemService = new ItemService(new ItemTable(this.items), new ItemTable(this.items))
  }

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
      this.itemService.add(item)
    }
  }

  public addExit(exit: Exit): void {
    this.exits.push(exit)
    if (this.builtService) {
      this.builtService.mobService.locationService.exitTable.exits.push(exit)
    }
  }

  public addMobLocation(mobLocation: MobLocation) {
    const location = this.locations.find(l => l.mob === mobLocation.mob)
    if (location) {
      location.room = mobLocation.room
      return
    }

    this.locations.push(mobLocation)
  }

  public async createService(startRoom: Room): Promise<GameService> {
    if (this.builtService) {
      return this.builtService
    }
    const roomTable = RoomTable.new(this.rooms)
    const locationService = new LocationService(roomTable, this.eventService, new ExitTable(this.exits), this.locations)
    const mobService = new MobService(
      new MobTable(this.mobs),
      new MobTable(this.mobs),
      new FightTable(this.fights),
      locationService)
    const timeService = new TimeService(this.time)
    const weatherService = new WeatherService()
    const skillTable = getSkillTable(mobService, this.eventService)
    const spellTable = getSpellTable(
      mobService, this.eventService, this.itemService, new StateService(weatherService, timeService))
    this.builtService = new GameService(
      mobService,
      roomTable,
      this.itemService,
      this.eventService,
      new ActionService(
        getActionTable(mobService, this.itemService, timeService, this.eventService, weatherService, spellTable),
        skillTable,
        spellTable),
      new StateService(
        weatherService,
        timeService))
    await this.attachEventConsumers(startRoom)
    return this.builtService
  }

  private async attachEventConsumers(room: Room) {
    const gameServer = new GameServer(
      null,
      room,
      new ClientService(
        this.eventService,
        new AuthService(jest.fn()(), this.builtService.mobService),
        this.builtService.mobService.locationService,
        this.builtService.getActions(),
        this.clients),
      this.eventService)
    const eventConsumers = await eventConsumerTable(
      this.builtService,
      gameServer,
      this.builtService.mobService,
      this.itemService,
      new FightBuilder(this.eventService, this.builtService.mobService.locationService),
      this.eventService)
    eventConsumers.forEach(eventConsumer => this.eventService.addConsumer(eventConsumer))
  }
}
