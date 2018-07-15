import { Region } from "../region/model/region"
import { Room } from "../room/model/room"

export default class WorldBuilder {
  private regions: Region[] = []
  private rooms: Room[] = []

  constructor(public readonly rootRoom: Room) {}

  public addRegion(region: Region) {
    this.regions.push(region)
    this.rooms.push(...region.rooms)
  }

  public getRooms(): Room[] {
    return this.rooms
  }

  public async addRootRegion(region: Region) {
    this.addRegion(region)
  }
}
