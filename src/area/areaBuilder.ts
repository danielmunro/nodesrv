import { Mob } from "../mob/model/mob"
import { getFreeReciprocalDirection } from "../room/direction"
import { newReciprocalExit } from "../room/factory"
import { Room } from "../room/model/room"
import MobCollection from "./mobCollection"
import RoomCollection from "./roomCollection"
import { SectionType } from "./sectionType"

export default class AreaBuilder {
  private rooms = new RoomCollection()
  private mobs = new MobCollection()
  private activeRoom: Room
  private lastRoom: Room
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
      newReciprocalExit(getFreeReciprocalDirection(this.allRooms[0], room), this.allRooms[0], room)
    }
  }

  public buildSection(sectionType: SectionType): Room {
    const room = this.rooms.getRandomBySectionType(sectionType)
    this.allRooms.push(room)
    this.mobs.getRandomBySectionType(sectionType).forEach((mob) => room.addMob(mob))

    if (this.activeRoom) {
      newReciprocalExit(getFreeReciprocalDirection(this.activeRoom, room), this.activeRoom, room)
        .forEach((exit) => this.allExits.push(exit))
    }

    if (sectionType === SectionType.Root) {
      this.activeRoom = room
      newReciprocalExit(getFreeReciprocalDirection(this.outsideConnection, room), this.outsideConnection, room)
        .forEach((exit) => this.allExits.push(exit))
    }

    this.lastRoom = room

    return room
  }

  public activateLastRoom() {
    this.activeRoom = this.lastRoom
  }

  public getAllRooms() {
    return this.allRooms
  }

  public getAllExits() {
    return this.allExits
  }
}
