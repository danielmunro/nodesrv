import { ActionType } from "../action/actionType"
import { Definition } from "../action/definition/definition"
import { DamageType } from "../damage/damageType"
import { improveSkill, improveSpell } from "../improve/improve"
import ItemTable from "../item/itemTable"
import { Trigger } from "../mob/enum/trigger"
import MobService from "../mob/mobService"
import { Mob } from "../mob/model/mob"
import { RequestType } from "../request/requestType"
import { Direction } from "../room/constants"
import ExitTable from "../room/exitTable"
import { Room } from "../room/model/room"
import { default as RoomTable } from "../room/roomTable"
import SkillDefinition from "../skill/skillDefinition"
import { SkillType } from "../skill/skillType"
import SpellDefinition from "../spell/spellDefinition"
import { SpellType } from "../spell/spellType"

export default class GameService {
  public static async new(
    mobService: MobService,
    roomTable: RoomTable = new RoomTable({}),
    itemTable: ItemTable = new ItemTable([]),
    exitTable: ExitTable = new ExitTable(mobService.locationService, []),
    time: number = 0,
  ): Promise<GameService> {
    return new GameService(
      mobService, roomTable, itemTable, exitTable, time)
  }

  constructor(
    public readonly mobService: MobService,
    public readonly roomTable: RoomTable,
    public readonly itemTable: ItemTable,
    public readonly exitTable: ExitTable,
    private time = 0) {
  }

  public incrementTime() {
    this.time += 1
  }

  public getCurrentTime() {
    return this.time
  }

  public resetTime() {
    this.time = 0
  }

  public async moveMob(mob: Mob, direction: Direction) {
    const exits = this.exitTable.exitsForMob(mob)
    const exit = exits.find(e => e.direction === direction)

    if (!exit) {
      throw new Error("cannot move in that direction")
    }

    const destination = this.roomTable.get(exit.destination.uuid)

    return this.mobService.locationService.updateMobLocation(mob, destination)
  }

  public getMobLocation(mob: Mob) {
    return this.mobService.locationService.getLocationForMob(mob)
  }

  public getMobsByRoom(room: Room): Mob[] {
    return this.mobService.locationService.getMobsByRoom(room)
  }

  public createActionDefinition(requestType: RequestType, action, precondition = null): Definition {
    return new Definition(this, requestType, action, precondition)
  }

  public createSkillDefinition(skillType: SkillType, trigger: Trigger, action, precondition = null) {
    return new SkillDefinition(this, skillType, [trigger], improveSkill(action), precondition)
  }

  public createSpellDefinition(
    spellType: SpellType, actionType: ActionType, action, precondition, damageType: DamageType = null) {
    return new SpellDefinition(this, spellType, actionType, precondition, improveSpell(action), damageType)
  }
}
