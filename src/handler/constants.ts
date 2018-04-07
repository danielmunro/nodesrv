export enum RequestType {
  Node = "node",
  Gossip = "gossip",
  Get = "get",
  Drop = "drop",
  Inventory = "inventory",
  Look = "look",
  North = "north",
  South = "south",
  East = "east",
  West = "west",
  Up = "up",
  Down = "down",
  Wear = "wear",
  Remove = "remove",
  Equipped = "equipped",
  Kill = "kill",
  Bash = "bash",
  Cast = "cast",
  Affects = "affects",
  Noop = "noop",
  Any = "any",
}

export enum ActionType {
  Offensive,
  Neutral,
  Defensive,
}
