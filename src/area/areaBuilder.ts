import { Mob } from "../mob/model/mob"
import { Room } from "../room/model/room"
import MobCollection from "./mobCollection"
import RoomCollection from "./roomCollection"
import { SectionType } from "./sectionType"

export default class AreaBuilder {
  private rooms = new RoomCollection()
  private mobs = new MobCollection()

  constructor(public readonly rootRoom: Room) {
    this.rooms.add(SectionType.Root, rootRoom)
  }

  public addMob(sectionType: SectionType, mob: Mob, chanceToPopPercent: number) {
    this.mobs.add(sectionType, mob, chanceToPopPercent)
  }

  public addRoom(sectionType: SectionType, room: Room) {
    this.rooms.add(sectionType, room)
  }

  public build(sectionType: SectionType): Room {
    const room = this.rooms.getRandomBySectionType(sectionType)
    this.mobs.getRandomBySectionType(sectionType).forEach((mob) => room.addMob(mob))

    return room
  }
}
