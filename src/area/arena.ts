import roll, { coinFlip, getRandomInt } from "../dice/dice"
import { Mob } from "../mob/model/mob"
import { cardinalDirections, Direction } from "../room/constants"
import { getFreeReciprocalDirection, isCardinalDirection } from "../room/direction"
import { newReciprocalExit, newRoom } from "../room/factory"
import { Exit } from "../room/model/exit"
import { Room } from "../room/model/room"

export class Arena {
  public readonly connectingRoom: Room
  public readonly exitRoom: Room
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
    const connectingRooms = this.getConnectingRooms(root)
    this.connectingRoom = connectingRooms[0]
    this.exitRoom = connectingRooms[1]
  }

  private getConnectingRooms(root): Room[] {
    if (this.hasNoAvailableConnections(root)) {
      throw new Error("root has no available connections")
    }

    const connectingRoom = this.getRandomEdge()
    const exitRoom = this.getRandomEdge()

    if (!getFreeReciprocalDirection(root, connectingRoom)) {
      return this.getConnectingRooms(root)
    }

    return [connectingRoom, exitRoom]
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

  private getRandomEdge(): Room {
    const edge = roll(1, 4)
    let x
    let y
    if (edge === 1) {
      y = 0
      x = getRandomInt(this.matrix[0].length - 1)
    } else if (edge === 2) {
      y = getRandomInt(this.matrix.length - 1)
      x = this.matrix[0].length - 1
    } else if (edge === 3) {
      y = this.matrix.length - 1
      x = getRandomInt(this.matrix[0].length - 1)
    } else if (edge === 4) {
      y = getRandomInt(this.matrix.length - 1)
      x = 0
    }

    return this.matrix[y][x]
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

  private hasNoAvailableConnections(room: Room) {
    return room.exits.filter((e) => isCardinalDirection(e.direction)).length === cardinalDirections.length
  }
}
