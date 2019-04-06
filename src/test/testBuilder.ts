import Action from "../action/action"
import Skill from "../action/impl/skill"
import Spell from "../action/impl/spell"
import {Client} from "../client/client"
import GameService from "../gameService/gameService"
import ServiceBuilder from "../gameService/serviceBuilder"
import ItemBuilder from "../item/itemBuilder"
import {Item} from "../item/model/item"
import WeaponBuilder from "../item/weaponBuilder"
import {newMobLocation} from "../mob/factory"
import {Fight} from "../mob/fight/fight"
import {Mob} from "../mob/model/mob"
import {SpecializationType} from "../mob/specialization/specializationType"
import {Player} from "../player/model/player"
import {Terrain} from "../region/enum/terrain"
import newRegion from "../region/factory"
import InputContext from "../request/context/inputContext"
import {Request} from "../request/request"
import RequestBuilder from "../request/requestBuilder"
import {RequestType} from "../request/requestType"
import Response from "../request/response"
import {Direction} from "../room/constants"
import {newReciprocalExit, newRoom} from "../room/factory"
import {Exit} from "../room/model/exit"
import {Room} from "../room/model/room"
import Email from "../session/auth/login/email"
import Session from "../session/session"
import {SkillType} from "../skill/skillType"
import {SpellType} from "../spell/spellType"
import {getSuccessfulAction} from "../support/functional/times"
import {getTestMob} from "./mob"
import MobBuilder from "./mobBuilder"
import {getTestPlayer} from "./player"
import PlayerBuilder from "./playerBuilder"
import RoomBuilder from "./roomBuilder"

const ws = jest.fn(() => ({
  close: jest.fn(),
  send: jest.fn(),
}))

export default class TestBuilder {
  public player: Player
  public room: Room
  private lastRoom: Room
  private mobForRequest: Mob
  private serviceBuilder: ServiceBuilder = new ServiceBuilder()

  public async withClient() {
    if (!this.player) {
      await this.withPlayer()
    }
    const service = await this.getService()
    const client = new Client(
      new Session(new Email(jest.fn()())),
      ws(),
      "127.0.0.1",
      service.getActions(),
      service.mobService.locationService,
      service.eventService)
    await client.session.login(client, this.player)
    this.mobForRequest = client.getSessionMob()
    this.serviceBuilder.addMob(this.mobForRequest)
    this.serviceBuilder.addClient(client)

    return client
  }

  public withRoom(direction?: Direction): RoomBuilder {
    return this.buildRoomOnto(this.room, direction)
  }

  public addRoomToPreviousRoom(direction?: Direction): RoomBuilder {
    return this.buildRoomOnto(this.lastRoom, direction)
  }

  public async withPlayer(fn: (player: Player) => void = () => { /**/ }): Promise<PlayerBuilder> {
    const player = getTestPlayer()

    if (!this.player) {
      this.player = player
      this.mobForRequest = player.sessionMob
    }

    if (!this.room) {
      this.withRoom()
    }

    this.serviceBuilder.addMobLocation(newMobLocation(player.sessionMob, this.room))
    this.serviceBuilder.addMob(player.sessionMob)

    if (fn) {
      fn(player)
    }

    return new PlayerBuilder(player)
  }

  public withMob(name?: string, specialization: SpecializationType = SpecializationType.Warrior): MobBuilder {
    const mob = getTestMob(name)
    mob.specializationType = specialization
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

  public withMobBuilder(name?: string): MobBuilder {
    const mob = getTestMob(name)
    return new MobBuilder(mob, this.serviceBuilder)
  }

  public withItem(): ItemBuilder {
    return new ItemBuilder(this.serviceBuilder, new Item(), this.mobForRequest)
  }

  public withWeapon(): WeaponBuilder {
    return new WeaponBuilder(this.serviceBuilder, this.mobForRequest)
  }

  public async fight(target = this.withMob().mob): Promise<Fight> {
    const service = await this.getService()
    const fight = new Fight(
      service.eventService,
      this.mobForRequest, target,
      this.room)
    service.mobService.addFight(fight)

    return fight
  }

  public useMob(mobBuilder: MobBuilder): TestBuilder {
    this.mobForRequest = mobBuilder.mob
    return this
  }

  public useRoom(room: Room): TestBuilder {
    this.room = room
    return this
  }

  public createRequest(
    requestType: RequestType,
    input: string = requestType.toString(),
    targetMobInRoom?: Mob): Request {
    if (!this.mobForRequest) {
      this.withMob()
    }
    return new Request(
      this.mobForRequest,
      this.room,
      new InputContext(requestType, input),
      targetMobInRoom)
  }

  public async createRequestBuilder() {
    const service = await this.getService()
    return new RequestBuilder(service.getActions(), service.mobService.locationService, this.mobForRequest, this.room)
  }

  public async successfulAction(request: Request) {
    return getSuccessfulAction(
      await this.getAction(request.getType()),
      request)
  }

  public async handleAction(requestType: RequestType, input?: string, target?: Mob): Promise<Response> {
    const action = await this.getAction(requestType)
    return action.handle(this.createRequest(requestType, input, target))
  }

  public async getAction(requestType: RequestType): Promise<Action> {
    return (await this.getService()).getAction(requestType)
  }

  public async getSkill(skillType: SkillType): Promise<Skill | undefined> {
    return (await this.getService()).getSkill(skillType)
  }

  public async getSpell(spellType: SpellType): Promise<Spell> {
    return (await this.getService()).getSpell(spellType)
  }

  public setTime(time: number) {
    this.serviceBuilder.setTime(time)

    return this
  }

  public async getService(): Promise<GameService> {
    return this.serviceBuilder.createService(this.room)
  }

  private addExit(exit: Exit) {
    this.serviceBuilder.addExit(exit)
  }

  private buildRoomOnto(source: Room, direction?: Direction): RoomBuilder {
    const room = newRoom("a test room", "description of a test room")
    room.region = newRegion("a test region", Terrain.Plains)

    if (!this.room) {
      this.room = room
      if (this.player) {
        this.serviceBuilder.addMobLocation(newMobLocation(this.player.sessionMob, room))
      }
    } else {
      newReciprocalExit(source, room, direction).forEach(exit => this.addExit(exit))
    }

    this.lastRoom = room
    this.serviceBuilder.addRoom(room)

    return new RoomBuilder(room)
  }
}
