import getActionTable from "../action/actionTable"
import {Client} from "../client/client"
import eventConsumerTable from "../event/eventConsumerTable"
import EventService from "../event/eventService"
import ItemService from "../item/itemService"
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
  private roomTable = new RoomTable()
  private mobs: Mob[] = []
  private exits: Exit[] = []
  private recallRoomId: string

  constructor(
    private readonly eventService: EventService,
    private readonly itemService: ItemService) {
  }

  public setRecallRoomId(recallRoomId: string): void {
    this.recallRoomId = recallRoomId
  }

  public setTime(time: number) {
    this.time = time
  }

  public addRoom(room: Room): void {
    this.roomTable.add(room)
  }

  public addClient(client: Client) {
    this.clients.push(client)
  }

  public addMob(mob: Mob): void {
    this.mobs.push(mob)
  }

  public addItem(item: Item): void {
    this.itemService.add(item)
  }

  public addExit(exit: Exit): void {
    this.exits.push(exit)
  }

  public addMobLocation(mobLocation: MobLocation) {
    const location = this.locations.find(l => l.mob === mobLocation.mob)
    if (location) {
      location.room = mobLocation.room
      return
    }

    this.locations.push(mobLocation)
  }

  public createLocationService() {
    return new LocationService(
      this.roomTable,
      this.eventService,
      new ExitTable(this.exits),
      this.locations,
      this.recallRoomId)
  }

  public createMobService(locationService: LocationService) {
    return new MobService(
      new MobTable(this.mobs),
      new MobTable(this.mobs),
      new FightTable(this.fights),
      locationService)
  }

  public async createService(startRoom: Room, mobService: MobService): Promise<GameService> {
    if (this.builtService) {
      return this.builtService
    }
    this.mobService = mobService
    const timeService = new TimeService(this.time)
    const weatherService = new WeatherService()
    const skillTable = getSkillTable(mobService, this.eventService)
    const spellTable = getSpellTable(
      mobService, this.eventService, this.itemService, new StateService(weatherService, timeService))
    this.builtService = new GameService(
      mobService,
      new ActionService(
        getActionTable(mobService, this.itemService, timeService, this.eventService, weatherService, spellTable),
        skillTable,
        spellTable),
      new StateService(
        weatherService,
        timeService))
    await this.attachEventConsumers(startRoom, mobService)
    return this.builtService
  }

  private async attachEventConsumers(room: Room, mobService: MobService) {
    const gameServer = new GameServer(
      null,
      room,
      new ClientService(
        this.eventService,
        new AuthService(jest.fn()(), mobService),
        mobService.locationService,
        this.builtService.getActions(),
        this.clients),
      this.eventService)
    const eventConsumers = await eventConsumerTable(
      this.builtService,
      gameServer,
      mobService,
      this.itemService,
      new FightBuilder(this.eventService, mobService.locationService),
      this.eventService)
    eventConsumers.forEach(eventConsumer => this.eventService.addConsumer(eventConsumer))
  }
}
