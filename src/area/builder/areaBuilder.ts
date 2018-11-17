import { Item } from "../../item/model/item"
import { getItemRepository } from "../../item/repository/item"
import { Mob } from "../../mob/model/mob"
import { persistMob } from "../../mob/repository/mob"
import { Direction } from "../../room/constants"
import { newReciprocalExit } from "../../room/factory"
import { Room } from "../../room/model/room"
import Service from "../../service/service"
import ItemCollection from "../itemCollection"
import MobCollection from "../mobCollection"
import RoomCollection from "../roomCollection"
import SectionCollection from "../sectionCollection"
import DefaultSpec from "../sectionSpec/defaultSpec"
import SectionSpec from "../sectionSpec/sectionSpec"
import { SectionType } from "../sectionType"
import sectionTypeMap from "../sectionTypeMap"

export default class AreaBuilder {
  private static findSectionBuilderBySectionType(sectionType: SectionType) {
    return sectionTypeMap.find((typeMap) => typeMap.type === sectionType)
  }

  private rooms = new RoomCollection()
  private mobs = new MobCollection()
  private items = new ItemCollection()
  private activeRoom: Room
  private allRooms = []
  private exitRoom: Room

  constructor(
    public readonly outsideConnection: Room,
    private readonly service: Service) {
    this.rooms.add(SectionType.OutsideConnection, new DefaultSpec(outsideConnection))
    this.activeRoom = outsideConnection
    this.allRooms.push(outsideConnection)
  }

  public setExitRoom(room: Room) {
    this.exitRoom = room
  }

  public getExitRoom() {
    return this.exitRoom
  }

  public addMobTemplate(sectionType: SectionType, mob: Mob, chanceToPopPercent: number = 1) {
    this.mobs.add(sectionType, mob, chanceToPopPercent)
  }

  public addRoomTemplate(sectionType: SectionType, sectionSpec: SectionSpec) {
    this.rooms.add(sectionType, sectionSpec)
  }

  public addItemTemplate(sectionType: SectionType, item: Item, chanceToPopPercent: number = 1) {
    this.items.add(sectionType, item, chanceToPopPercent)
  }

  public async buildSection(sectionType: SectionType, direction: Direction = null): Promise<SectionCollection> {
    const builder = AreaBuilder.findSectionBuilderBySectionType(sectionType)
    const sectionCollection = await new builder.section().build(this.rooms.getRandomSpecBySectionType(sectionType))
    const items = []
    sectionCollection.rooms.forEach((sectionRoom) => {
      this.items.getRandomBySectionType(sectionType).forEach(async (item) => {
        sectionRoom.inventory.addItem(item)
        items.push(item)
      })
    })
    const itemRepository = await getItemRepository()
    await itemRepository.save(items)
    this.allRooms.push(...sectionCollection.rooms)
    const room = sectionCollection.getConnectingRoom()
    await this.buildAndConnectRoom(room, sectionType, direction)
    this.activeRoom = room

    return sectionCollection
  }

  public getAllRooms() {
    return this.allRooms
  }

  public getRoomsBySection(sectionType: SectionType) {
    return this.allRooms.filter((room) => room.sectionType === sectionType)
  }

  private async buildAndConnectRoom(room: Room, sectionType: SectionType, direction: Direction) {
    await this.addMobsToRoom(sectionType, room)
    await this.createExits(room, direction)
  }

  private async createExits(room: Room, direction: Direction) {
    await this.service.saveExit(newReciprocalExit(this.activeRoom, room, direction))
  }

  private async addMobsToRoom(sectionType: SectionType, room: Room) {
    await Promise.all(
      this.mobs.getRandomBySectionType(sectionType).map((mob) => {
        // room.addMob(mob)
        return persistMob(mob)
      }))
  }
}
