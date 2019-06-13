import { RoomEntity } from "../../room/entity/roomEntity"
import { newRoom } from "../../room/factory/roomFactory"

export function getTestRoom(): RoomEntity {
  return newRoom("Test room 1", "This is a test room.")
}
