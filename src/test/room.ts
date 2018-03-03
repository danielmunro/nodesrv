import * as v4 from "uuid"
import { Room } from "./../room/room"
import { getTestMob } from "./mob"
import { Exit } from "../room/exit";
import { Direction } from "../room/constants";

export function getTestRoom(): Room {
  return new Room(
    v4(),
    "test room name",
    "test room description",
    [
      new Exit("test-room-id-1", Direction.Up),
      new Exit("test-room-id-2", Direction.Down),
    ])
}
