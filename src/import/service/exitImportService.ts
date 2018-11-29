import { Direction } from "../../room/constants"
import { newExit } from "../../room/factory"
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
    const ids = Object.keys(file.roomMap)
    for (const importId of ids) {
      const room = file.roomDataMap[importId]
      if (room === undefined || room.doors === undefined) {
        continue
      }
      for (const door of room.doors) {
        await this.createExitFromDoor(door, importId)
      }
    }
  }

  private async createExitFromDoor(door, importId) {
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
    }
    const source = await this.roomTable.getByImportId(importId)
    const destination = await this.roomTable.getByImportId(door.vnum)

    if (source && destination) {
      await this.exitRepository.save(newExit(direction, source, destination))
    }
  }
}
