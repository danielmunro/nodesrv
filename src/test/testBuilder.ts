import Action from "../action/action"
import Skill from "../action/skill"
import Spell from "../action/spell"
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
import {Exit} from "../room/model/exit"
import {Room} from "../room/model/room"
import ClientService from "../server/clientService"
import {GameServer} from "../server/server"
import AuthService from "../session/auth/authService"
import Email from "../session/auth/login/email"
import Session from "../session/session"
import {getSkillTable} from "../skill/skillTable"
import {SkillType} from "../skill/skillType"
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
      new Session(new Email(jest.fn()())),
      ws(),
      "127.0.0.1",
      service.getActions(),
      service.mobService.locationService,
      await this.getEventService())
    await client.session.login(client, this.player)
    this.mobForRequest = client.getSessionMob()
    this.serviceBuilder.addMob(this.mobForRequest)

    return client
  }

  public withRoom(direction?: Direction) {
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

  public async withPlayer(fn: (player: Player) => void = () => { /**/ }): Promise<PlayerBuilder> {
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

  public withMob(name?: string, specialization: SpecializationType = SpecializationType.Warrior): MobBuilder {
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

  public withTrainer(name?: string): MobBuilder {
    const mobBuilder = this.withMob(name)
    mobBuilder.mob.traits.trainer = true

    return mobBuilder
  }

  public withMerchant() {
    const mobBuilder = this.withMob(name)
    mobBuilder.mob.shop = new Shop()

    return mobBuilder
  }

  public with(fn: (player: Player) => {}) {
    fn(this.player)
  }

  public async fight(target = this.withMob().mob): Promise<Fight> {
    await this.getService()
    const fight = new Fight(
      await this.getEventService(),
      this.mobForRequest, target,
      this.room)
    this.service.mobService.addFight(fight)

    return fight
  }

  public createRequest(
    requestType: RequestType,
    input: string = requestType.toString(),
    target?: Mob | Item): Request {
    if (!this.mobForRequest) {
      this.withMob()
    }
    return new Request(this.mobForRequest, this.room, new InputContext(requestType, input), target)
  }

  public async createRequestBuilder() {
    return new RequestBuilder(this.mobForRequest, this.room)
  }

  public async getActionDefinition(requestType: RequestType): Promise<Action> {
    return (await this.getService()).getAction(requestType)
  }

  public async getSkillDefinition(skillType: SkillType): Promise<Skill | undefined> {
    return getSkillTable(await this.getService()).find((skill: Skill) => skill.getSkillType() === skillType)
  }

  public async getSpellDefinition(spellType: SpellType): Promise<Spell> {
    return getSpellTable(await this.getService()).find(spell => spell.getSpellType() === spellType)
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

  public addExit(exit: Exit) {
    this.serviceBuilder.addExit(exit)
  }

  private async attachEventConsumers() {
    const gameServer = new GameServer(
      null,
      this.room,
      new ClientService(
        this.eventService,
        new AuthService(jest.fn()(), this.service.mobService),
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
}
