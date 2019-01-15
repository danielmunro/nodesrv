import {Action} from "../action/definition/action"
import Check from "../check/check"
import CheckedRequest from "../check/checkedRequest"
import {CheckStatus} from "../check/checkStatus"
import {Client} from "../client/client"
import eventConsumerTable from "../event/eventConsumerTable"
import EventService from "../event/eventService"
import GameService from "../gameService/gameService"
import ServiceBuilder from "../gameService/serviceBuilder"
import {Item} from "../item/model/item"
import {newMobLocation} from "../mob/factory"
import {Fight} from "../mob/fight/fight"
import FightBuilder from "../mob/fight/fightBuilder"
import {Mob} from "../mob/model/mob"
import Shop from "../mob/model/shop"
import {SpecializationType} from "../mob/specialization/specializationType"
import {AuthorizationLevel} from "../player/authorizationLevel"
import {Player} from "../player/model/player"
import newRegion from "../region/factory"
import {Terrain} from "../region/terrain"
import InputContext from "../request/context/inputContext"
import {Request} from "../request/request"
import RequestBuilder from "../request/requestBuilder"
import {RequestType} from "../request/requestType"
import {Direction} from "../room/constants"
import {newReciprocalExit, newRoom} from "../room/factory"
import {Room} from "../room/model/room"
import ClientService from "../server/clientService"
import {GameServer} from "../server/server"
import Session from "../session/session"
import Skill from "../skill/skill"
import {getSkillTable} from "../skill/skillTable"
import {SkillType} from "../skill/skillType"
import Spell from "../spell/spell"
import getSpellTable from "../spell/spellTable"
import {SpellType} from "../spell/spellType"
import {getTestMob} from "./mob"
import MobBuilder from "./mobBuilder"
import {getTestPlayer} from "./player"
import PlayerBuilder from "./playerBuilder"
import RoomBuilder from "./roomBuilder"

const ws = jest.fn(() => ({
  send: jest.fn(),
}))

export default class TestBuilder {
  public player: Player
  public room: Room
  private mobForRequest: Mob
  private service: GameService
  private eventService: EventService
  private serviceBuilder: ServiceBuilder = new ServiceBuilder()

  public async withClient() {
    if (!this.player) {
      await this.withPlayer()
    }
    if (!this.room) {
      this.withRoom()
    }
    const service = await this.getService()
    const client = new Client(
      new Session(null),
      ws(),
      "127.0.0.1",
      service.getActions(),
      this.serviceBuilder.locationService,
      await this.getEventService())
    await client.session.login(client, this.player)
    this.mobForRequest = client.getSessionMob()
    this.serviceBuilder.addMob(this.mobForRequest)

    return client
  }

  public withRoom(direction: Direction = null) {
    const room = newRoom("a test room", "description of a test room")
    room.region = newRegion("a test region", Terrain.Plains)

    if (!this.room) {
      this.room = room
      if (this.player) {
        this.serviceBuilder.addMobLocation(newMobLocation(this.player.sessionMob, room))
      }
    } else {
      newReciprocalExit(this.room, room, direction).forEach(exit => this.addExit(exit))
    }

    this.serviceBuilder.addRoom(room)

    return new RoomBuilder(room, this.serviceBuilder)
  }

  public async withPlayerAndSkill(skillType: SkillType, level: number = 1): Promise<Player> {
    const playerBuilder = await this.withPlayer()
    playerBuilder.withSkill(skillType, level)

    return this.player
  }

  public async withPlayer(fn = null): Promise<PlayerBuilder> {
    const player = getTestPlayer()

    if (!this.player) {
      this.player = player
      this.mobForRequest = player.sessionMob
    }

    if (this.room) {
      this.serviceBuilder.addMobLocation(newMobLocation(player.sessionMob, this.room))
    }
    this.serviceBuilder.addMob(player.sessionMob)

    if (fn) {
      fn(player)
    }

    return new PlayerBuilder(player, this.serviceBuilder)
  }

  public async withAdminPlayer(
    authorizationLevel: AuthorizationLevel = AuthorizationLevel.Admin): Promise<PlayerBuilder> {
    const playerBuilder = await this.withPlayer()
    playerBuilder.player.sessionMob.playerMob.authorizationLevel = authorizationLevel

    return playerBuilder
  }

  public withMob(name: string = null, specialization: SpecializationType = SpecializationType.Warrior): MobBuilder {
    const mob = getTestMob(name)
    mob.specialization = specialization
    if (!this.room) {
      this.withRoom()
    }
    this.serviceBuilder.addMobLocation(newMobLocation(mob, this.room))
    this.serviceBuilder.addMob(mob)

    if (!this.mobForRequest) {
      this.mobForRequest = mob
    }

    return new MobBuilder(mob, this.serviceBuilder)
  }

  public withTrainer(name: string = null): MobBuilder {
    const mobBuilder = this.withMob(name)
    mobBuilder.mob.traits.trainer = true

    return mobBuilder
  }

  public withMerchant() {
    const mobBuilder = this.withMob(name)
    mobBuilder.mob.shop = new Shop()

    return mobBuilder
  }

  public with(fn) {
    fn(this.player)
  }

  public async fight(target = this.withMob().mob): Promise<Fight> {
    await this.getService()
    const fight = new Fight(
      await this.getEventService(),
      this.mobForRequest, target,
      this.room)
    this.serviceBuilder.addFight(fight)

    return fight
  }

  public createOkCheckedRequest(
    requestType: RequestType,
    input: string = null,
    result: any = null): CheckedRequest {
    return this.createCheckedRequest(requestType, CheckStatus.Ok, input, result)
  }

  public createRequest(
    requestType: RequestType,
    input: string = requestType.toString(),
    target: Mob | Item = null): Request {
    if (!this.mobForRequest) {
      this.withMob()
    }
    return new Request(this.mobForRequest, this.room, new InputContext(requestType, input), target)
  }

  public async createRequestBuilder() {
    return new RequestBuilder(this.mobForRequest, this.room)
  }

  public async getActionCollection(): Promise<Action[]> {
    return (await this.getService()).getActions()
  }

  public async getActionDefinition(requestType: RequestType) {
    return (await this.getService()).getActionDefinition(requestType)
  }

  public async getSkillDefinition(skillType: SkillType): Promise<Skill> {
    return getSkillTable(await this.getService()).find(skill => skill.skillType === skillType)
  }

  public async getSpellDefinition(spellType: SpellType): Promise<Spell> {
    return getSpellTable(await this.getService()).find(spell => spell.spellType === spellType)
  }

  public setTime(time: number) {
    this.serviceBuilder.setTime(time)

    return this
  }

  public async getService(): Promise<GameService> {
    if (!this.service) {
      this.eventService = new EventService()
      this.service = await this.serviceBuilder.createService(this.eventService)
      await this.attachEventConsumers()
    }
    return this.service
  }

  public async getEventService() {
    if (!this.eventService) {
      this.eventService = new EventService()
      await this.attachEventConsumers()
    }
    return this.eventService
  }

  public addExit(exit) {
    this.serviceBuilder.addExit(exit)
  }

  private async attachEventConsumers() {
    const gameServer = new GameServer(
      null,
      null,
      new ClientService(
        this.eventService,
        null,
        this.service.mobService.locationService,
        this.service.getActions(),
      ),
      this.eventService)
    const eventConsumers = await eventConsumerTable(
      this.service,
      gameServer,
      this.service.mobService,
      this.service.itemService,
      new FightBuilder(this.eventService, this.service.mobService.locationService))
    eventConsumers.forEach(eventConsumer => this.eventService.addConsumer(eventConsumer))
  }

  private createCheckedRequest(
    requestType: RequestType,
    checkStatus: CheckStatus,
    input: string = null,
    result: any = null): CheckedRequest {
    if (!input) {
      input = requestType.toString()
    }

    return new CheckedRequest(
      new Request(this.player.sessionMob, this.room, new InputContext(requestType, input)),
      new Check(checkStatus, result),
    )
  }
}
