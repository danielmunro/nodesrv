import { Room } from "../../room/model/room"
import SectionSpec from "./sectionSpec"

export default class DefaultSpec implements SectionSpec {
  constructor(public readonly templateRoom: Room) {}

  public getRoomTemplate(): Room {
    return this.templateRoom
  }
}
