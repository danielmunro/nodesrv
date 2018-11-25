/**
 * Reset commands:
 *   '*': comment
 *   'M': read a mobile
 *   'O': read an object
 *   'P': put object in object
 *   'G': give object to mobile
 *   'E': equip object to mobile
 *   'D': set state of door
 *   'R': randomize room exits
 *   'S': stop (end of list)
 */
export enum ResetFlag {
  Mob = "M",
  Item = "O",
  PutItemInContainer = "P",
  GiveItemToMob = "G",
  EquipItemToMob = "E",
  Door = "D",
  RandomRoomExits = "R",
}
