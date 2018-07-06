import { Mob } from "../mob/model/mob"
import { Direction } from "../room/constants"
import { newReciprocalExit } from "../room/factory"
import { Exit } from "../room/model/exit"
import { Room } from "../room/model/room"
import { persistExit, persistRoom } from "../room/service"
import MobCollection from "./mobCollection"
import RoomCollection from "./roomCollection"
import SectionCollection from "./sectionCollection"
import DefaultSpec from "./sectionSpec/defaultSpec"
import SectionSpec from "./sectionSpec/sectionSpec"
import { SectionType } from "./sectionType"
import sectionTypeMap from "./sectionTypeMap"

export default class AreaBuilder {
  private static async createExitsBetween(room1: Room, room2: Room, direction: Direction = null): Promise<Exit[]> {
    return newReciprocalExit(room1, room2, direction)
  }

  private rooms = new RoomCollection()
  private mobs = new MobCollection()
  private activeRoom: Room
  private allRooms = []

  constructor(public readonly outsideConnection: Room) {
    this.rooms.add(SectionType.OutsideConnection, new DefaultSpec(outsideConnection))
    this.activeRoom = outsideConnection
    this.allRooms.push(outsideConnection)
  }

  public addMobTemplate(sectionType: SectionType, mob: Mob, chanceToPopPercent: number = 1) {
    this.mobs.add(sectionType, mob, chanceToPopPercent)
  }

  public addRoomTemplate(sectionType: SectionType, sectionSpec: SectionSpec) {
    this.rooms.add(sectionType, sectionSpec)
  }

  public async buildSection(sectionType: SectionType, direction: Direction = null): Promise<SectionCollection> {
    const spec = this.rooms.getRandomBySectionType(sectionType)
    const map = sectionTypeMap.find((typeMap) => typeMap.type === sectionType)
    const sectionCollection = await new map.section().build(spec)
    const room = sectionCollection.getConnectingRoom()
    this.allRooms.push(...sectionCollection.rooms)
    this.mobs.getRandomBySectionType(sectionType).forEach((mob) => room.addMob(mob))
    const exits = await AreaBuilder.createExitsBetween(this.activeRoom, room, direction)
    await persistRoom(room)
    await persistExit(exits)
    this.activeRoom = room

    return sectionCollection
  }

  public getAllRooms() {
    return this.allRooms
  }
}
