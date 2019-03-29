import EventService from "../event/eventService"
import {Direction} from "../room/constants"
import ExitTable from "../room/exitTable"
import { Room } from "../room/model/room"
import RoomTable from "../room/roomTable"
import MobMoveEvent from "./event/mobMoveEvent"
import { Mob } from "./model/mob"
import MobLocation from "./model/mobLocation"

const RECALL_ROOM_ID = "3001"

export default class LocationService {

  constructor(
    private readonly roomTable: RoomTable,
    private readonly eventService: EventService,
    private readonly exitTable: ExitTable,
    private mobLocations: MobLocation[] = []) {}

  public getRecall(): Room | undefined {
    return this.roomTable.get(RECALL_ROOM_ID)
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
      if (mobLocation.mob.uuid === mob.uuid) {
        const from = mobLocation.room
        const eventResponse = await this.eventService.publish(new MobMoveEvent(
          mob,
          from,
          room,
          direction))
        if (eventResponse.isSatisifed()) {
          return
        }
        mobLocation.room = room
        return
      }
    }
  }

  public getLocationForMob(mob: Mob): MobLocation {
    const mobLocation = this.mobLocations.find(it => it.mob === mob)
    if (!mobLocation) {
      throw new Error("mob not found")
    }
    return mobLocation
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

  public getMobsByImportId(importId: string) {
    return this.mobLocations.filter(mobLocation => mobLocation.mob.importId === importId)
      .map(mobLocation => mobLocation.mob)
  }

  public findMobsByArea(area: string): MobLocation[] {
    return this.mobLocations.filter(mobLocation => mobLocation.room.area === area)
  }
}
