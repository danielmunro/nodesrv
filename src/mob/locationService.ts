import EventService from "../event/eventService"
import {Direction} from "../room/constants"
import ExitTable from "../room/exitTable"
import { Room } from "../room/model/room"
import RoomTable from "../room/roomTable"
import MobMoveEvent from "./event/mobMoveEvent"
import { Mob } from "./model/mob"
import MobLocation from "./model/mobLocation"

export default class LocationService {
  constructor(
    private readonly roomTable: RoomTable,
    private readonly exitTable: ExitTable,
    private readonly eventService: EventService,
    private mobLocations: MobLocation[] = []) {}

  public async moveMob(mob: Mob, direction: Direction) {
    const location = this.getLocationForMob(mob)
    const exits = this.exitTable.exitsForRoom(location.room)
    const exit = exits.find(e => e.direction === direction)

    if (!exit) {
      throw new Error("cannot move in that direction")
    }

    const source = this.roomTable.get(exit.source.uuid)
    const destination = this.roomTable.get(exit.destination.uuid)
    this.updateMobLocation(mob, destination)
    await this.eventService.publish(new MobMoveEvent(mob, source, destination))
  }

  public getMobLocationCount(): number {
    return this.mobLocations.length
  }

  public addMobLocation(mobLocation: MobLocation) {
    this.mobLocations.push(mobLocation)
  }

  public updateMobLocation(mob: Mob, room: Room) {
    for (const mobLocation of this.mobLocations) {
      if (mobLocation.mob.uuid === mob.uuid) {
        mobLocation.room = room
        return
      }
    }
  }

  public getLocationForMob(mob: Mob): MobLocation {
    return this.mobLocations.find(mobLocation => mobLocation.mob === mob)
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

  public getMobsByImportId(importId) {
    return this.mobLocations.filter(mobLocation => mobLocation.mob.importId === importId)
      .map(mobLocation => mobLocation.mob)
  }
}
