import { Room } from "../../room/model/room"

export default interface SectionSpec {
  getRoomTemplate(): Room
}
