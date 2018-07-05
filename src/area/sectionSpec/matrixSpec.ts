import { Room } from "../../room/model/room"
import SectionSpec from "./sectionSpec"

export default class MatrixSpec implements SectionSpec {
  constructor(
    public readonly templateRoom: Room,
    public readonly width: number,
    public readonly height: number) {}

  public getRoomTemplate(): Room {
    return this.templateRoom
  }
}
