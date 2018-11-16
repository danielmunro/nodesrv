import getActionCollection from "../action/actionCollection"
import { Collection } from "../action/definition/collection"
import Check from "../check/check"
import CheckComponent from "../check/checkComponent"
import CheckedRequest from "../check/checkedRequest"
import { CheckStatus } from "../check/checkStatus"
import { Item } from "../item/model/item"
import { addFight, Fight, reset } from "../mob/fight/fight"
import { Mob } from "../mob/model/mob"
import { Role } from "../mob/role"
import { AuthorizationLevel } from "../player/authorizationLevel"
import { Player } from "../player/model/player"
import InputContext from "../request/context/inputContext"
import { Request } from "../request/request"
import RequestBuilder from "../request/requestBuilder"
import { RequestType } from "../request/requestType"
import { newReciprocalExit, newRoom } from "../room/factory"
import { Room } from "../room/model/room"
import Service from "../service/service"
import ServiceBuilder from "../service/serviceBuilder"
import { SkillType } from "../skill/skillType"
import { getTestMob } from "./mob"
import MobBuilder from "./mobBuilder"
import { getTestPlayer } from "./player"
import PlayerBuilder from "./playerBuilder"
import RoomBuilder from "./roomBuilder"

export default class TestBuilder {
  public player: Player
  public room: Room
  private mobForRequest: Mob
  private service: Service
  private serviceBuilder: ServiceBuilder = new ServiceBuilder()

  constructor() {
    reset()
  }

  public withRoom() {
    const room = newRoom("a test room", "description of a test room")

    if (!this.room) {
      this.room = room
      if (this.player) {
        room.addMob(this.player.sessionMob)
      }
    } else {
      newReciprocalExit(this.room, room).forEach(exit => this.addExit(exit))
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
      this.room.addMob(player.sessionMob)
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
    this.room.addMob(mob)
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

  public fight(target = this.withMob().mob): Fight {
    const fight = new Fight(this.mobForRequest, target, this.room)
    addFight(fight)

    return fight
  }

  public async createCheckedRequestFrom(
    requestType: RequestType,
    check: (request: Request) => Promise<Check>,
    input: string = requestType.toString(),
    target = null): Promise<CheckedRequest> {
    const request = this.createRequest(requestType, input, target)

    return new CheckedRequest(request, await check(request))
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
    return new RequestBuilder(this.mobForRequest, this.room, (await this.getService()).mobTable)
  }

  public async getActionCollection(): Promise<Collection> {
    return getActionCollection(await this.getService())
  }

  public async getService(): Promise<Service> {
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
