import { Mob } from "../mob/model/mob"
import { Direction } from "../room/constants"
import { getFreeReciprocalDirection } from "../room/direction"
import { newReciprocalExit } from "../room/factory"
import { Exit } from "../room/model/exit"
import { Room } from "../room/model/room"
import { persistExit, persistRoom } from "../room/service"
import MobCollection from "./mobCollection"
import RoomCollection from "./roomCollection"
import { SectionType } from "./sectionType"

export default class AreaBuilder {
  private static async createExitsBetween(room1: Room, room2: Room, direction: Direction = null): Promise<Exit[]> {
    if (!direction) {
      direction = getFreeReciprocalDirection(room1, room2)
    }
    return newReciprocalExit(direction, room1, room2)
  }

  private rooms = new RoomCollection()
  private mobs = new MobCollection()
  private activeRoom: Room
  private allRooms = []

  constructor(public readonly outsideConnection: Room) {
    this.rooms.add(SectionType.OutsideConnection, outsideConnection)
    this.activeRoom = outsideConnection
    this.allRooms.push(outsideConnection)
  }

  public addMobTemplate(sectionType: SectionType, mob: Mob, chanceToPopPercent: number = 1) {
    this.mobs.add(sectionType, mob, chanceToPopPercent)
  }

  public addRoomTemplate(sectionType: SectionType, room: Room) {
    this.rooms.add(sectionType, room)
  }

  public async buildSection(sectionType: SectionType, direction: Direction = null): Promise<Room> {
    const room = this.rooms.getRandomBySectionType(sectionType)
    this.allRooms.push(room)
    this.mobs.getRandomBySectionType(sectionType).forEach((mob) => room.addMob(mob))
    const exits = await AreaBuilder.createExitsBetween(this.activeRoom, room, direction)
    await persistRoom(room)
    await Promise.all(exits.map((exit) => persistExit(exit)))
    this.activeRoom = room

    return room
  }

  public getAllRooms() {
    return this.allRooms
  }
}
