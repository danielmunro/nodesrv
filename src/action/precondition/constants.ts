// buying
export const MESSAGE_ERROR_NO_ITEM = "They don't have that."
export const MESSAGE_ERROR_CANNOT_AFFORD = "You can't afford it."

// casting
export const MESSAGE_NO_SPELL = "What do you want to cast?"
export const MESSAGE_SPELL_DOES_NOT_EXIST = "That is not a spell."
export const MESSAGE_CAST_ERROR = "You don't know that spell."
export const MESSAGE_CAST_FAIL = "You lose your concentration."
export const MESSAGE_FAIL_NOT_ENOUGH_MANA = "You don't have enough mana."

// general -- items
export const MESSAGE_FAIL_CONTAINER_NOT_FOUND = "That container isn't here."

// eating
export const MESSAGE_FAIL_CANNOT_EAT_ITEM = "You can't eat that."
export const MESSAGE_FAIL_ALREADY_FULL = "You are too full to eat more."

// flee
export const MESSAGE_FAIL_NOT_FIGHTING = "You're not fighting anyone."
export const MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE = "You don't see any directions to flee."
export const MESSAGE_FAIL_TOO_TIRED = "You are too tired to flee."

// get
export const MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE = "You cannot get that."

// kill
export const MESSAGE_FAIL_KILL_NO_TARGET = "Who would you like to kill?"
export const MESSAGE_FAIL_KILL_ALREADY_FIGHTING = "No way! You are already fighting."
export const MESSAGE_FAIL_CANNOT_ATTACK_SELF = "No way! You can't attacks yourself."

// move
export const MESSAGE_DIRECTION_DOES_NOT_EXIST = "Alas, that direction does not exist."
export const MESSAGE_OUT_OF_MOVEMENT = "You are too tired."

// remove
export const MESSAGE_REMOVE_FAIL = "You aren't wearing that."

// sleeping
export const MESSAGE_FAIL_DEAD = "You are dead."

// wake
export const MESSAGE_FAIL_ALREADY_AWAKE = "You're already awake."

// sacrifice
export const MESSAGE_FAIL_CONTAINER_NOT_EMPTY = "That is not empty."

export const Messages = {
  All: {
    Arguments: {
      Buy: "What do you want to buy?",
      Close: "What do you want to close?",
      Lock: "What do you want to lock?",
      Open: "What do you want to open?",
      Unlock: "What do you want to unlock?",
    },
    Item: {
      CannotRemoveCursedItem: "{0} is cursed and binds to your flesh.",
      CannotSacrifice: "You cannot sacrifice that.",
      NoMerchant: "You don't see a merchant anywhere.",
      NoRemoveItem: "{0} cannot be removed.",
      NotEquipment: "That is not equipment.",
      NotFound: "You don't see that anywhere.",
      NotOwned: "You don't have that.",
    },
  },
  Buy: {
    CannotAfford: "You can't afford it.",
  },
  Close: {
    Fail: {
      AlreadyClosed: "That is already closed.",
      CannotClose: "You cannot close that.",
      NotFound: "You can't find that anywhere.",
    },
  },
  Lock: {
    Fail: {
      AlreadyLocked: "That is already locked.",
      NoKey: "You lack the key.",
    },
    Success: "{0} lock a {1}.",
  },
  Lore: {
    FailNotIdentified: "{item} is not identified yet.",
  },
  Move: {
    Fail: {
      DoorIsClosed: "The door is closed.",
    },
  },
  Open: {
    Fail: {
      AlreadyOpen: "That is already open.",
      Locked: "That is locked.",
      NotFound: "You can't find that.",
    },
    Success: "{0} open {1}.",
  },
  Remove: {
    Success: "You remove {0} and put it in your inventory.",
  },
  Sleep: {
    AlreadySleeping: "You are already asleep.",
  },
  Train: {
    CannotTrainMore: "You can't train that anymore.",
    LackingTrains: "You need more training sessions first.",
    NoTrainer: "No trainer is here.",
    NotStanding: "You must be standing to train.",
  },
  Unlock: {
    Fail: {
      AlreadyUnlocked: "That is already unlocked.",
      NoKey: "You lack the key.",
      NotFound: "You can't find that.",
    },
    Success: "{0} unlock a {1}.",
  },
}
