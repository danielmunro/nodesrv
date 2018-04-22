import roll from "../dice/dice"
import { Mob } from "../mob/model/mob"
import { Direction } from "../room/constants"
import { getFreeReciprocalDirection } from "../room/direction"
import { newReciprocalExit, newRoom } from "../room/factory"
import { Exit } from "../room/model/exit"
import { Room } from "../room/model/room"

export class Arena {
  public readonly connectingRoom
  public readonly matrix = []
  public readonly width
  public readonly height
  public readonly rooms: Room[] = []
  public readonly exits: Exit[] = []
  private readonly mobFactory: () => Mob

  constructor(root: Room, width: number, height: number, mobFactory: () => Mob) {
    this.width = width
    this.height = height
    this.mobFactory = mobFactory
    this.buildMatrix(root)
    this.connectingRoom = this.matrix[0][0]
    this.addReciprocalExitToArena(
      getFreeReciprocalDirection(root, this.connectingRoom),
      root,
      this.connectingRoom)
  }

  private buildMatrix(root: Room) {
    for (let y = 0; y < this.height; y++) {
      this.matrix[y] = []
      for (let x = 0; x < this.width; x++) {
        this.matrix[y][x] = newRoom(root.name, root.description)
        if (roll(1, 2) === 1) {
          this.matrix[y][x].mobs.push(this.mobFactory())
        }
        this.connectRoomAtCoords(x, y)
      }
    }
  }

  private connectRoomAtCoords(x: number, y: number) {
    const current = this.matrix[y][x]

    if (x > 0) {
      this.addReciprocalExitToArena(Direction.West, current, this.matrix[y][x - 1])
    }

    if (y > 0) {
      this.addReciprocalExitToArena(Direction.North, current, this.matrix[y - 1][x])
    }

    this.rooms.push(current)
  }

  private addReciprocalExitToArena(direction: Direction, room1: Room, room2: Room) {
    newReciprocalExit(direction, room1, room2).map((e) => this.exits.push(e))
  }
}
