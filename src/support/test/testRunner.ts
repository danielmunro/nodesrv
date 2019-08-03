import {inject, injectable} from "inversify"
import Action from "../../action/impl/action"
import Skill from "../../action/impl/skill"
import {Client} from "../../client/client"
import StateService from "../../gameService/stateService"
import ItemBuilder from "../../item/builder/itemBuilder"
import WeaponBuilder from "../../item/builder/weaponBuilder"
import {createItem, createWeapon} from "../../item/factory/itemFactory"
import ItemService from "../../item/service/itemService"
import {MobEntity} from "../../mob/entity/mobEntity"
import {Fight} from "../../mob/fight/fight"
import FightBuilder from "../../mob/fight/fightBuilder"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import {SkillType} from "../../mob/skill/skillType"
import SpecializationService from "../../mob/specialization/service/specializationService"
import PlayerTable from "../../player/table/playerTable"
import InputContext from "../../request/context/inputContext"
import {RequestType} from "../../request/enum/requestType"
import Request from "../../request/request"
import Response from "../../request/response"
import {RoomEntity} from "../../room/entity/roomEntity"
import {Direction} from "../../room/enum/direction"
import {newReciprocalExit} from "../../room/factory/roomFactory"
import ExitTable from "../../room/table/exitTable"
import RoomTable from "../../room/table/roomTable"
import ClientService from "../../server/service/clientService"
import doNTimes from "../functional/times"
import {Types} from "../types"
import {getTestMob} from "./mob"
import MobBuilder from "./mobBuilder"
import {getTestPlayer} from "./player"
import PlayerBuilder from "./playerBuilder"
import {getTestRoom} from "./room"
import RoomBuilder from "./roomBuilder"

const ws = jest.fn(() => ({
  close: jest.fn(),
  onmessage: jest.fn(),
  send: jest.fn(),
}))

const mockRequest = jest.fn()

@injectable()
export default class TestRunner {
  private firstMob: MobEntity

  constructor(
    @inject(Types.MobService) private readonly mobService: MobService,
    @inject(Types.FightBuilder) private readonly fightBuilder: FightBuilder,
    @inject(Types.LocationService) private readonly locationService: LocationService,
    @inject(Types.ClientService) private readonly clientService: ClientService,
    @inject(Types.RoomTable) private readonly roomTable: RoomTable,
    @inject(Types.ExitTable) private readonly exitTable: ExitTable,
    @inject(Types.ItemService) private readonly itemService: ItemService,
    @inject(Types.Actions) private readonly actions: Action[],
    @inject(Types.Skills) private readonly skills: Skill[],
    @inject(Types.StateService) private readonly stateService: StateService,
    @inject(Types.SpecializationService) private readonly specializationService: SpecializationService,
    @inject(Types.PlayerTable) private readonly playerTable: PlayerTable,
  ) {}

  public createItem(): ItemBuilder {
    const item = createItem()
    this.itemService.add(item)
    this.getStartRoom().addItem(item)
    return new ItemBuilder(item)
  }

  public createWeapon(): WeaponBuilder {
    const weapon = createWeapon()
    this.itemService.add(weapon)
    return new WeaponBuilder(weapon)
  }

  public async createMob(room: RoomEntity = this.getStartRoom().room): Promise<MobBuilder> {
    const mob = getTestMob()
    await this.mobService.add(mob, room)
    if (!this.firstMob) {
      this.firstMob = mob
    }

    return new MobBuilder(this.specializationService, mob)
  }

  public async createAndSetMainMob(): Promise<MobBuilder> {
    const mobBuilder = await this.createMob()
    this.firstMob = mobBuilder.get()
    return mobBuilder
  }

  public async createPlayer(): Promise<PlayerBuilder> {
    const player = getTestPlayer()
    const websocket = ws() as any
    const client = this.clientService.createNewClient(websocket, null)
    client.player = player
    await this.mobService.add(player.sessionMob, this.getStartRoom().room)
    this.playerTable.add(player)
    if (!this.firstMob) {
      this.firstMob = player.sessionMob
    }
    return new PlayerBuilder(this.specializationService, player)
  }

  public createClient(): Client {
    return this.clientService.createNewClient(ws() as any, mockRequest())
  }

  public async createLoggedInClient(): Promise<Client> {
    const client = this.createClient()
    await client.session.login(client, (await this.createPlayer()).get())
    return client
  }

  public createRoom(direction?: Direction): RoomBuilder {
    const room = getTestRoom()
    const rooms = this.roomTable.getRooms()
    if (rooms.length) {
      const lastRoom = rooms[rooms.length - 1]
      newReciprocalExit(lastRoom, room, direction).forEach(exit => this.exitTable.add(exit))
    }
    this.roomTable.add(room)
    return new RoomBuilder(room)
  }

  public createRoomOffOf(roomBuilder: RoomBuilder, direction: Direction): RoomBuilder {
    const newRoom = getTestRoom()
    newReciprocalExit(roomBuilder.room, newRoom, direction)
      .forEach(exit => this.exitTable.add(exit))
    return new RoomBuilder(newRoom)
  }

  public createRequest(
    requestType: RequestType,
    input: string = requestType.toString(),
    targetMobInRoom?: MobEntity): Request {
    return new Request(
      this.firstMob,
      this.getStartRoom().get(),
      new InputContext(requestType, input),
      targetMobInRoom)
  }

  public async fight(target?: MobEntity): Promise<Fight> {
    if (!target) {
      target = (await this.createMob()).get()
    }
    const fight = this.fightBuilder.create(this.firstMob, target)
    this.mobService.addFight(fight)
    return fight
  }

  public getStartRoom(): RoomBuilder {
    return new RoomBuilder(this.locationService.getRecall())
  }

  public async invokeActionAs(
    mob: MobEntity, requestType: RequestType, input?: string, targetMobInRoom?: MobEntity): Promise<Response> {
    const action = this.actions.find(a => a.getRequestType() === requestType) as Action
    return await action.handle(
      new Request(
        mob,
        this.locationService.getRoomForMob(mob),
        new InputContext(requestType, input),
        targetMobInRoom))
  }

  public async invokeAction(requestType: RequestType, input?: string, targetMobInRoom?: MobEntity): Promise<Response> {
    if (!this.firstMob) {
      await this.createMob()
    }
    const action = this.actions.find(a => a.getRequestType() === requestType) as Action
    return await action.handle(
      new Request(
        this.firstMob,
        this.locationService.getRoomForMob(this.firstMob),
        new InputContext(requestType, input),
        targetMobInRoom))
  }

  public async invokeActionSuccessfully(
    requestType: RequestType, input?: string, targetMobInRoom?: MobEntity): Promise<Response> {
    const response = await this.invokeAction(requestType, input, targetMobInRoom)
    if (response.isFailure()) {
      return this.invokeActionSuccessfully(requestType, input, targetMobInRoom)
    }
    return response
  }

  public async invokeActionFailure(
    requestType: RequestType,
    input?: string,
    targetMobInRoom?: MobEntity,
    resetState: () => void = () => { /**/ }): Promise<Response> {
    const response = await this.invokeAction(requestType, input, targetMobInRoom)
    if (response.isSuccessful()) {
      resetState()
      return this.invokeActionFailure(requestType, input, targetMobInRoom, resetState)
    }
    return response
  }

  public async invokeSkill(skillType: SkillType, input?: string): Promise<Response> {
    const skill = this.skills.find(s => s.getSkillType() === skillType) as Skill
    return skill.handle(
      new Request(
        this.firstMob,
        this.locationService.getRoomForMob(this.firstMob),
        new InputContext(RequestType.Any, input)))
  }

  public async invokeSkillNTimes(iterations: number, skillType: SkillType, input?: string): Promise<Response[]> {
    return doNTimes(iterations, () => this.invokeSkill(skillType, input))
  }

  public setTime(time: number) {
    while (this.stateService.getCurrentTime() !== time) {
      this.stateService.incrementTime()
    }
  }
}
