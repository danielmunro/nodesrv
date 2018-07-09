import { Mob } from "../mob/model/mob"
import { Direction } from "../room/constants"
import { newReciprocalExit } from "../room/factory"
import { Room } from "../room/model/room"
import { persistExit } from "../room/service"
import MobCollection from "./mobCollection"
import RoomCollection from "./roomCollection"
import SectionCollection from "./sectionCollection"
import DefaultSpec from "./sectionSpec/defaultSpec"
import SectionSpec from "./sectionSpec/sectionSpec"
import { SectionType } from "./sectionType"
import sectionTypeMap from "./sectionTypeMap"

export default class AreaBuilder {
  private static findSectionBuilderBySectionType(sectionType: SectionType) {
    return sectionTypeMap.find((typeMap) => typeMap.type === sectionType)
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
    const builder = AreaBuilder.findSectionBuilderBySectionType(sectionType)
    const sectionCollection = await new builder.section().build(this.rooms.getRandomSpecBySectionType(sectionType))
    this.allRooms.push(...sectionCollection.rooms)
    const room = sectionCollection.getConnectingRoom()
    await this.buildAndConnectRoom(room, sectionType, direction)
    this.activeRoom = room

    return sectionCollection
  }

  public getAllRooms() {
    return this.allRooms
  }

  private async buildAndConnectRoom(room: Room, sectionType: SectionType, direction: Direction) {
    this.addMobsToRoom(sectionType, room)
    await this.createExits(room, direction)
  }

  private async createExits(room: Room, direction: Direction) {
    await persistExit(newReciprocalExit(this.activeRoom, room, direction))
  }

  private addMobsToRoom(sectionType: SectionType, room: Room) {
    this.mobs.getRandomBySectionType(sectionType).forEach((mob) => room.addMob(mob))
  }
}
