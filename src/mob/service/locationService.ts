import {inject, injectable} from "inversify"
import "reflect-metadata"
import {createMobMoveEvent} from "../../event/factory/eventFactory"
import EventService from "../../event/service/eventService"
import { RoomEntity } from "../../room/entity/roomEntity"
import {Direction} from "../../room/enum/direction"
import ExitTable from "../../room/table/exitTable"
import RoomTable from "../../room/table/roomTable"
import {Types} from "../../support/types"
import { MobEntity } from "../entity/mobEntity"
import MobLocationEntity from "../entity/mobLocationEntity"
import MobMoveEvent from "../event/mobMoveEvent"
import {newMobLocation} from "../factory/mobFactory"

@injectable()
export default class LocationService {
  constructor(
    @inject(Types.EventService) private readonly eventService: EventService,
    @inject(Types.RoomTable) private readonly roomTable: RoomTable,
    @inject(Types.ExitTable) private readonly exitTable: ExitTable,
    @inject(Types.StartRoom) private readonly startRoom: RoomEntity,
    private mobLocations: MobLocationEntity[] = []) {}

  public getRecall(): RoomEntity {
    return this.startRoom
  }

  public async moveMob(mob: MobEntity, direction: Direction) {
    const location = this.getLocationForMob(mob)
    const exitsForRoom = this.exitTable.exitsForRoom(location.room)
    const exit = exitsForRoom.find(e => e.direction === direction)

    if (!exit) {
      throw new Error("cannot move in that direction")
    }

    const canonicalRoom = this.roomTable.get(exit.destination.uuid)
    await this.updateMobLocation(mob, canonicalRoom, direction)
  }

  public getMobLocationCount(): number {
    return this.mobLocations.length
  }

  public async addMobLocation(mobLocation: MobLocationEntity) {
    const mob = mobLocation.mob
    const existingMobLocation = this.mobLocations.find(it => it.mob === mob)
    if (existingMobLocation) {
      await this.updateMobLocation(mob, mobLocation.room)
      return
    }
    this.mobLocations.push(mobLocation)
  }

  public async updateMobLocation(mob: MobEntity, room: RoomEntity, direction?: Direction) {
    for (const mobLocation of this.mobLocations) {
      if (mobLocation.mob.uuid !== mob.uuid) {
        continue
      }
      const eventResponse = await this.eventService.publish(createMobMoveEvent(
        mob,
        mobLocation.room,
        room,
        mobLocation.room.getMovementCost(),
        direction))
      if (eventResponse.isSatisfied()) {
        return
      }
      mob.mv -= (eventResponse.event as MobMoveEvent).mvCost
      mobLocation.room = room
      return
    }
    console.log(`update mob location called on ${mob.name}, but mob not known`)
    const newLocation = newMobLocation(mob, room)
    await this.addMobLocation(newLocation)
    return newLocation
  }

  public getLocationForMob(mob: MobEntity): MobLocationEntity {
    const mobLocation = this.mobLocations.find(it => it.mob === mob)
    if (!mobLocation) {
      throw Error(`${mob.name} (${mob.uuid}) not found in location service`)
    }
    return mobLocation
  }

  public getRoomForMob(mob: MobEntity): RoomEntity {
    const mobLocation = this.mobLocations.find(it => it.mob === mob)
    if (!mobLocation) {
      throw Error(`${mob.name} (${mob.uuid}) not found in location service`)
    }
    return mobLocation.room
  }

  public removeMob(mob: MobEntity): void {
    this.mobLocations = this.mobLocations.filter(mobLocation => mobLocation.mob !== mob)
  }

  public getMobsByRoom(room: RoomEntity) {
    return this.mobLocations.filter(mobLocation => mobLocation.room === room)
      .map(mobLocation => mobLocation.mob)
  }

  public getMobsInRoomWithMob(mob: MobEntity): MobEntity[] {
    const location = this.getLocationForMob(mob)
    return this.getMobsByRoom(location.room)
  }

  public getMobsByImportId(importId: string): MobEntity[] {
    return this.mobLocations.filter(mobLocation => mobLocation.mob.importId === importId)
      .map(mobLocation => mobLocation.mob)
  }

  public findMobsByArea(area: string): MobLocationEntity[] {
    return this.mobLocations.filter(mobLocation => mobLocation.room.area === area)
  }
}
