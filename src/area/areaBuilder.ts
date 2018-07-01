import { Mob } from "../mob/model/mob"
import { Room } from "../room/model/room"
import MobCollection from "./mobCollection"
import RoomCollection from "./roomCollection"
import { SectionType } from "./sectionType"
import { newReciprocalExit } from "../room/factory"
import { getFreeReciprocalDirection } from "../room/direction"

export default class AreaBuilder {
  private rooms = new RoomCollection()
  private mobs = new MobCollection()
  private room: Room
  private allRooms = []
  private allExits = []

  constructor(public readonly outsideConnection: Room) {
    this.rooms.add(SectionType.OutsideConnection, outsideConnection)
    this.allRooms.push(outsideConnection)
  }

  public addMobTemplate(sectionType: SectionType, mob: Mob, chanceToPopPercent: number = 1) {
    this.mobs.add(sectionType, mob, chanceToPopPercent)
  }

  public addRoomTemplate(sectionType: SectionType, room: Room) {
    this.rooms.add(sectionType, room)
    if (sectionType === SectionType.Root) {
      this.room = room
      newReciprocalExit(getFreeReciprocalDirection(this.allRooms[0], room), this.allRooms[0], room)
    }
  }

  // public buildDirection(sectionType: SectionType, direction: Direction) {
  //   newReciprocalExit(direction, this.room, this.buildSection(sectionType))
  // }

  // public buildShape(sectionType: SectionType, areaShape: AreaShape) {
  //
  // }

  public buildSection(sectionType: SectionType): Room {
    const room = this.rooms.getRandomBySectionType(sectionType)
    this.mobs.getRandomBySectionType(sectionType).forEach((mob) => room.addMob(mob))
    const direction = getFreeReciprocalDirection(this.room, room)
    newReciprocalExit(direction, this.room, room).forEach((exit) => this.allExits.push(exit))
    this.allRooms.push(room)

    return room
  }

  public getAllRooms() {
    return this.allRooms
  }

  public getAllExits() {
    return this.allExits
  }
}
