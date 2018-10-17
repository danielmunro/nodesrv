export const NOT_FOUND = "You don't see that anywhere."

export const MESSAGE_LOOK_CANNOT_SEE = "You can't see anything!"

export const MESSAGE_SUCCESS_STR = "You become stronger!"
export const MESSAGE_SUCCESS_INT = "You gain in intelligence!"
export const MESSAGE_SUCCESS_WIS = "Your wisdom increases!"
export const MESSAGE_SUCCESS_DEX = "Your dexterity increases!"
export const MESSAGE_SUCCESS_CON = "Your constitution grows!"
export const MESSAGE_SUCCESS_STA = "Your stamina increases!"
export const MESSAGE_SUCCESS_HP = "Your hp increases!"
export const MESSAGE_SUCCESS_MANA = "Your mana increases!"
export const MESSAGE_SUCCESS_MV = "Your movement increases!"

export const MAX_TRAINABLE_STATS = 4

export const FLEE_MOVEMENT_COST_MULTIPLIER = 3

export const Messages = {
  Buy: {
    Success: "{requestCreator} {verb} {item} for {value} gold",
  },
  Cast: {
    Success: "{requestCreator} {verb} the words, '{spell}'.",
  },
  Drop: {
    Success: "{requestCreator} {verb} {item}.",
  },
  Eat: {
    Success: "{requestCreator} {verb} {item}{affects}{full}.",
  },
  Flee: {
    Fail: "You fail to flee!",
    Success: "{requestCreator} {verb} to the {direction}!",
  },
  Get: {
    SuccessFromContainer: "{requestCreator} {verb} {item} from {container}.",
    SuccessFromRoom: "{requestCreator} {verb} {item}.",
  },
  Kill: {
    Success: "{requestCreator} {screamVerb} and {attackVerb} {target}!",
  },
  Put: {
    Success: "You put {item} in {container}.",
  },
  Sacrifice: {
    Success: "You sacrifice {0} to your deity, and are rewarded with {1} gold.",
  },
  Sell: {
    Success: "You sell {0} for {1} gold",
  },
  Sleep: {
    Success: "You lay down and go to sleep.",
  },
  Train: {
    Info: "You can train: {0}hp mana mv",
  },
  Wake: {
    Success: "You wake and stand up.",
  },
}
