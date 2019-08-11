import {ExitEntity} from "../../room/entity/exitEntity"
import {Direction} from "../../room/enum/direction"
import { newExit } from "../../room/factory/roomFactory"
import ExitRepository from "../../room/repository/exit"
import { DirectionFlag } from "../enum/directionFlag"
import File from "../file"
import RoomTable from "../table/roomTable"

export default class ExitImportService {
  constructor(
    public readonly roomTable: RoomTable,
    public readonly exitRepository: ExitRepository,
  ) {}

  public async materializeExits(file: File) {
    const exits = []
    const ids = Object.keys(file.roomMap)
    for (const importId of ids) {
      const room = file.roomDataMap[importId]
      if (!room.doors) {
        continue
      }
      for (const door of room.doors) {
        exits.push(await this.createExitFromDoor(door, importId))
      }
    }
    return exits
  }

  private async createExitFromDoor(door: any, importId: any): Promise<ExitEntity> {
    let direction: Direction
    switch (door.door) {
      case DirectionFlag.North:
        direction = Direction.North
        break
      case DirectionFlag.East:
        direction = Direction.East
        break
      case DirectionFlag.South:
        direction = Direction.South
        break
      case DirectionFlag.West:
        direction = Direction.West
        break
      case DirectionFlag.Up:
        direction = Direction.Up
        break
      case DirectionFlag.Down:
        direction = Direction.Down
        break
      default:
        console.error("no direction for door", door, importId)
        direction = Direction.Noop
    }
    const source = this.roomTable.getByImportId(importId)
    const destination = this.roomTable.getByImportId(door.vnum)

    return this.exitRepository.save(newExit(direction, source, destination))
  }
}
