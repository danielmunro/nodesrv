import { Direction } from "../room/constants"
import { newExit } from "../room/factory"
import ExitRepository from "../room/repository/exit"
import RoomRepository from "../room/repository/room"
import { DirectionFlag } from "./directionFlag"
import File from "./file"

export default class ExitMaterializer {
  constructor(
    public readonly roomRepository: RoomRepository,
    public readonly exitRepository: ExitRepository,
  ) {}

  public async materializeExits(file: File) {
    const ids = Object.keys(file.roomMap)
    const idLength = ids.length
    for (let i = 0; i < idLength; i++) {
      const importId = ids[i]
      const room = file.roomDataMap[importId]
      if (room === undefined || room.doors === undefined) {
        continue
      }
      const doorLength = room.doors.length
      for (let j = 0; j < doorLength; j++) {
        const door = room.doors[j]
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
    const source = await this.roomRepository.findOneByImportId(importId)
    const destination = await this.roomRepository.findOneByImportId(door.vnum)

    if (source && destination) {
      await this.exitRepository.save(newExit(direction, source, destination))
    }
  }
}
