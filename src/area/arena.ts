import roll, { getRandomInt } from "../dice/dice"
import { Mob } from "../mob/model/mob"
import { persistMob } from "../mob/repository/mob"
import { Direction } from "../room/constants"
import { newReciprocalExit, newRoom } from "../room/factory"
import { Exit } from "../room/model/exit"
import { Room } from "../room/model/room"
import { getExitRepository } from "../room/repository/exit"
import { getRoomRepository } from "../room/repository/room"
import { persistExit, persistRoom } from "../room/service"

export class Arena {
  public readonly matrix = []
  public readonly rooms: Room[] = []
  public readonly exits: Exit[] = []
  private readonly mobFactory: () => Mob
  private built = false

  constructor(
    public readonly root: Room,
    public readonly width: number,
    public readonly height: number, mobFactory: () => Mob) {
    this.mobFactory = mobFactory
  }

  public isBuilt(): boolean {
    return this.built
  }

  public async buildMatrix() {
    if (this.built) {
      throw new Error("arena already built")
    }
    await this.createMatrix()
    const edge = this.getRandomEdge()
    await persistRoom(this.root)
    await persistExit(newReciprocalExit(this.root, edge))
    this.built = true
  }

  public getRandomEdge(): Room {
    const sideOfMatrix = roll(1, 4)
    if (sideOfMatrix === 1) {
      return this.matrix[0][getRandomInt(this.width - 1)]
    } else if (sideOfMatrix === 2) {
      return this.matrix[getRandomInt(this.height - 1)][this.width - 1]
    } else if (sideOfMatrix === 3) {
      return this.matrix[this.height - 1][getRandomInt(this.width - 1)]
    } else if (sideOfMatrix === 4) {
      return this.matrix[getRandomInt(this.height - 1)][0]
    }
  }

  private async createMatrix() {
    const roomRepository = await getRoomRepository()
    for (let y = 0; y < this.height; y++) {
      this.matrix[y] = []
      for (let x = 0; x < this.width; x++) {
        this.matrix[y][x] = await roomRepository.save(newRoom(this.root.name, this.root.description))
        if (this.mobFactory && roll(1, 2) === 1) {
          const mob = this.mobFactory()
          this.matrix[y][x].addMob(mob)
          await persistMob(mob)
        }
        await this.connectRoomAtCoords(x, y)
      }
    }
  }

  private async connectRoomAtCoords(x: number, y: number) {
    const current = this.matrix[y][x]

    if (x > 0) {
      await this.addReciprocalExitToArena(Direction.West, current, this.matrix[y][x - 1])
    }

    if (y > 0) {
      await this.addReciprocalExitToArena(Direction.North, current, this.matrix[y - 1][x])
    }

    this.rooms.push(current)
  }

  private async addReciprocalExitToArena(direction: Direction, room1: Room, room2: Room) {
    const exits = newReciprocalExit(room1, room2, direction)
    const exitRepository = await getExitRepository()
    await exitRepository.save(exits)
    this.exits.push(...exits)
  }
}
