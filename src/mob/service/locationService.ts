import {inject, injectable} from "inversify"
import "reflect-metadata"
import EventService from "../../event/eventService"
import {createMobMoveEvent} from "../../event/factory"
import {Direction} from "../../room/enum/direction"
import { Room } from "../../room/model/room"
import ExitTable from "../../room/table/exitTable"
import RoomTable from "../../room/table/roomTable"
import {Types} from "../../support/types"
import {newMobLocation} from "../factory"
import { Mob } from "../model/mob"
import MobLocation from "../model/mobLocation"

@injectable()
export default class LocationService {
  constructor(
    @inject(Types.RoomTable) private readonly roomTable: RoomTable,
    @inject(Types.EventService) private readonly eventService: EventService,
    @inject(Types.ExitTable) private readonly exitTable: ExitTable,
    @inject(Types.StartRoom) private readonly startRoom: Room,
    private mobLocations: MobLocation[] = []) {}

  public getRecall(): Room {
    return this.startRoom
  }

  public async moveMob(mob: Mob, direction: Direction) {
    const location = this.getLocationForMob(mob)
    const exitsForRoom = this.exitTable.exitsForRoom(location.room)
    const exit = exitsForRoom.find(e => e.direction === direction)

    if (!exit) {
      throw new Error("cannot move in that direction")
    }

    const destination = this.roomTable.get(exit.destination.uuid)
    await this.updateMobLocation(mob, destination, direction)
  }

  public getMobLocationCount(): number {
    return this.mobLocations.length
  }

  public addMobLocation(mobLocation: MobLocation) {
    this.mobLocations.push(mobLocation)
  }

  public async updateMobLocation(mob: Mob, room: Room, direction?: Direction) {
    for (const mobLocation of this.mobLocations) {
      if (mobLocation.mob.uuid !== mob.uuid) {
        continue
      }
      const eventResponse = await this.eventService.publish(createMobMoveEvent(
        mob,
        mobLocation.room,
        room,
        direction))
      if (eventResponse.isSatisfied()) {
        return
      }
      mobLocation.room = room
      return
    }
    console.log(`update mob location called on ${mob.name}, but mob not known`)
    const newLocation = newMobLocation(mob, room)
    this.addMobLocation(newLocation)
    return newLocation
  }

  public getLocationForMob(mob: Mob): MobLocation {
    const mobLocation = this.mobLocations.find(it => it.mob === mob)
    if (!mobLocation) {
      throw Error(`${mob.name} (${mob.uuid}) not found in location service`)
    }
    return mobLocation
  }

  public getRoomForMob(mob: Mob): Room {
    const mobLocation = this.mobLocations.find(it => it.mob === mob)
    if (!mobLocation) {
      throw Error(`${mob.name} (${mob.uuid}) not found in location service`)
    }
    return mobLocation.room
  }

  public removeMob(mob: Mob): void {
    this.mobLocations = this.mobLocations.filter(mobLocation => mobLocation.mob !== mob)
  }

  public getMobsByRoom(room: Room) {
    return this.mobLocations.filter(mobLocation => mobLocation.room === room)
      .map(mobLocation => mobLocation.mob)
  }

  public getMobsInRoomWithMob(mob: Mob): Mob[] {
    const location = this.getLocationForMob(mob)
    return this.getMobsByRoom(location.room)
  }

  public getMobsByImportId(importId: string): Mob[] {
    return this.mobLocations.filter(mobLocation => mobLocation.mob.importId === importId)
      .map(mobLocation => mobLocation.mob)
  }

  public findMobsByArea(area: string): MobLocation[] {
    return this.mobLocations.filter(mobLocation => mobLocation.room.area === area)
  }
}
