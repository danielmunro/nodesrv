import getActionCollection from "../action/actionCollection"
import { Collection } from "../action/definition/collection"
import Check from "../check/check"
import CheckComponent from "../check/checkComponent"
import CheckedRequest from "../check/checkedRequest"
import { CheckStatus } from "../check/checkStatus"
import { Client } from "../client/client"
import GameService from "../gameService/gameService"
import ServiceBuilder from "../gameService/serviceBuilder"
import { Item } from "../item/model/item"
import { Role } from "../mob/enum/role"
import { newMobLocation } from "../mob/factory"
import { Fight } from "../mob/fight/fight"
import { Mob } from "../mob/model/mob"
import MobLocation from "../mob/model/mobLocation"
import { AuthorizationLevel } from "../player/authorizationLevel"
import { Player } from "../player/model/player"
import { getPlayerRepository } from "../player/repository/player"
import newRegion from "../region/factory"
import { Terrain } from "../region/terrain"
import InputContext from "../request/context/inputContext"
import { Request } from "../request/request"
import RequestBuilder from "../request/requestBuilder"
import { RequestType } from "../request/requestType"
import { Direction } from "../room/constants"
import { newReciprocalExit, newRoom } from "../room/factory"
import { Room } from "../room/model/room"
import { default as AuthService } from "../session/auth/service"
import SkillDefinition from "../skill/skillDefinition"
import { getSkillTable } from "../skill/skillTable"
import { SkillType } from "../skill/skillType"
import SpellDefinition from "../spell/spellDefinition"
import getSpellTable from "../spell/spellTable"
import { SpellType } from "../spell/spellType"
import { getTestMob } from "./mob"
import MobBuilder from "./mobBuilder"
import { getTestPlayer } from "./player"
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
  private serviceBuilder: ServiceBuilder = new ServiceBuilder()

  public addMobLocation(mobLocation: MobLocation) {
    this.serviceBuilder.addMobLocation(mobLocation)
  }

  public async withClient() {
    if (!this.player) {
      await this.withPlayer()
    }
    if (!this.room) {
      this.withRoom()
    }
    const service = await this.getService()
    const client = new Client(
      ws(),
      "127.0.0.1",
      await getActionCollection(service),
      service,
      this.room,
      new AuthService(await getPlayerRepository()),
      this.serviceBuilder.locationService)
    await client.session.login(this.player)
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

  public withMob(name: string = null): MobBuilder {
    const mob = getTestMob(name)
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
    mobBuilder.mob.role = Role.Trainer

    return mobBuilder
  }

  public withMerchant() {
    const mobBuilder = this.withMob(name)
    mobBuilder.mob.role = Role.Merchant

    return mobBuilder
  }

  public with(fn) {
    fn(this.player)
  }

  public async fight(target = this.withMob().mob): Promise<Fight> {
    const fight = new Fight(await this.getService(), this.mobForRequest, target, this.room)
    this.serviceBuilder.addFight(fight)

    return fight
  }

  public createOkCheckedRequest(
    requestType: RequestType,
    input: string = null,
    result: any = null,
    checkComponents: CheckComponent[] = []): CheckedRequest {
    return this.createCheckedRequest(requestType, CheckStatus.Ok, input, result, checkComponents)
  }

  public createRequest(
    requestType: RequestType,
    input: string = requestType.toString(),
    target: Mob | Item = null): Request {
    return new Request(this.mobForRequest, this.room, new InputContext(requestType, input), target)
  }

  public async createRequestBuilder() {
    return new RequestBuilder(this.mobForRequest, this.room, (await this.getService()).mobService.mobTable)
  }

  public async getActionCollection(): Promise<Collection> {
    return getActionCollection(await this.getService())
  }

  public async getSkillDefinition(skillType: SkillType): Promise<SkillDefinition> {
    return getSkillTable(await this.getService()).find(skill => skill.skillType === skillType)
  }

  public async getSpellDefinition(spellType: SpellType): Promise<SpellDefinition> {
    return getSpellTable(await this.getService()).findSpell(spellType)
  }

  public setTime(time: number) {
    this.serviceBuilder.setTime(time)

    return this
  }

  public async getService(): Promise<GameService> {
    if (!this.service) {
      this.service = await this.serviceBuilder.createService()
    }
    return this.service
  }

  public addExit(exit) {
    this.serviceBuilder.addExit(exit)
  }

  private createCheckedRequest(
    requestType: RequestType,
    checkStatus: CheckStatus,
    input: string = null,
    result: any = null,
    checkComponents: CheckComponent[] = []): CheckedRequest {
    if (!input) {
      input = requestType.toString()
    }

    return new CheckedRequest(
      new Request(this.player.sessionMob, this.room, new InputContext(requestType, input)),
      new Check(checkStatus, result, checkComponents),
    )
  }
}
