import {MudName} from "../gameService/constants"

export const MAX_TRAINABLE_STATS = 4
export const FLEE_MOVEMENT_COST_MULTIPLIER = 3
export const Messages = {
  Alias: {
    AliasAlreadySet: "That alias is already set.",
    AliasDoesNotExist: "That alias does not exist.",
    TooManyAliases: "You already have too many aliases.",
  },
  Bounty: {
    NeedAmount: "How much gold do you want to set on that bounty?",
    NeedMoreGold: "You need more gold.",
    Success: "You set a bounty of {value} on {target}.",
  },
  Buy: {
    Success: "{requestCreator} {verb} {item} for {value} gold",
  },
  Cast: {
    Fail: "You lose your concentration.",
    Success: "{requestCreator} {verb} the words, '{spell}'.",
  },
  CloseContainer: {
    Success: "{requestCreator} {closeVerb} {item}.",
  },
  CloseDoor: {
    Success: "{requestCreator} {closeVerb} a {door} {direction}.",
  },
  Consider: {
    Death: "Death will thank you for your gift.",
    EasyKill: "{0} looks like an easy kill.",
    FeelLucky: "{0} says 'Do you feel lucky, punk?'",
    LaughsMercilessly: "{0} laughs at you mercilessly.",
    NakedAndWeaponless: "You can kill {0} naked and weaponless.",
    NoMatch: "{0} is no match for you.",
    PerfectMatch: "The perfect match!",
  },
  Demote: {
    Fail: {
      NoMoreDemotions: "{0} has no more demotions.",
    },
  },
  Drop: {
    Success: "{requestCreator} {verb} {item}.",
  },
  Eat: {
    Success: "{requestCreator} {verb} {item}{affects}{full}.",
  },
  Event: {
    Failed: "event failed",
    Success: "event succeeded",
  },
  Flee: {
    Fail: "You fail to flee!",
    Success: "{requestCreator} {verb} to the {direction}!",
  },
  Follow: {
    NotAllowed: "They are not accepting followers at this time.",
    Success: "{requestCreator} {verb} following {target}.",
  },
  Get: {
    SuccessFromContainer: "{requestCreator} {verb} {item} from {container}.",
    SuccessFromRoom: "{requestCreator} {verb} {item}.",
  },
  Help: {
    Fail: "No help topic exists for that.",
    NoActionHelpTextProvided: "More information coming soon.",
  },
  Kill: {
    Success: "{requestCreator} {screamVerb} and {attackVerb} {target}!",
  },
  Level: {
    Success: "You gain a level!",
  },
  LocateItem: {
    Fail: "You can't find anything like that on heaven or earth.",
  },
  Lock: {
    Success: "{requestCreator} {lockVerb} a {door} {direction}.",
  },
  Look: {
    Fail: "You can't see anything!",
    NotFound: "You don't see that anywhere.",
  },
  Loot: {
    CorpseDoesNotHaveItem: "The corpse has nothing like that.",
    NoCorpse: "That isn't here.",
    NotACorpse: "That has not a corpse.",
  },
  Lore: {
    Success: "{item} details:\nlevel: {level}  weight: {weight}  value: {value}",
  },
  NoFollow: {
    Success: "{requestCreator} {verb} accepting followers.",
  },
  OpenContainer: {
    Success: "{requestCreator} {openVerb} {item}.",
  },
  OpenDoor: {
    Success: "{requestCreator} {openVerb} a {door} {direction}.",
  },
  Owned: {
    Info: "{room} is owned by {owner}.",
    NotOwnable: "{room} cannot be owned.",
    OwnableButNotOwned: "{room} does not have an owner.",
  },
  Practice: {
    CannotImproveAnymore: "You cannot improve anymore.",
    CannotPractice: "You can't practice that.",
    MobNotHere: "You don't see anyone who can help you practice.",
    NotEnoughPractices: "You don't have any practices.",
    Success: "You get better at {toPractice}!",
  },
  Promote: {
    Fail: {
      NoMorePromotions: "{0} has no more promotions.",
    },
  },
  Put: {
    Success: "You put {item} in {container}.",
  },
  Reply: {
    NoLastTell: "No one has told you anything.",
  },
  Room: {
    Accept: {
      Accepted: "Congratulations! Your bid on {room} was accepted.",
      BidNotFound: "That bid was not found.",
      Rejected: "Sorry! Your bid on {room} was rejected. You've been refunded {gold} gold.",
      RoomNotOwned: "You don't own this room.",
      Success: "You accept the bid from {mob} on {room}. You receive {gold} gold.",
    },
    Bid: {
      AlreadyOwn: "You already own this room.",
      AmountIsRequired: "What is the amount of gold you'd like to bid?",
      CannotBid: "This room cannot be bid on.",
      NotBeingSold: "This room is not currently being sold.",
      NotEnoughGold: "You don't have that much gold.",
      Success: "You bid {amount} gold on {room}.",
    },
    BidList: {
      NoBids: "This room has no bids.",
      Success: "Bids on {room}:{bids}",
    },
    Info: "",
    Sell: {
      AmountIsRequired: "What is the asking price?",
      RoomIsNotOwned: "The room is not owned.",
      RoomIsNotOwnedByYou: "You do not own this room.",
      Success: "You have successfully listed {room} for {amount} gold.",
    },
  },
  Sacrifice: {
    Success: "You sacrifice {0} to your deity, and are rewarded with {1} gold.",
  },
  Sell: {
    Success: "{requestCreator} {verb} {item} for {value} gold",
  },
  ShieldBash: {
    Fail: "{requestCreator} {verb} to shield bash {target} but {verb2}.",
    Success: "{requestCreator} {verb} {target} in the face with {requestCreator2} shield.",
  },
  Sitting: {
    Success: "{requestCreator} {verb} down.",
  },
  Sleep: {
    Success: "{requestCreator} {verb} down and {verb2} to sleep.",
  },
  Time: {
    Info: "The current time is {0} o'clock {1}.",
  },
  Trade: {
    AlreadyInitialized: "A trade with {target} has already been initialized.",
    Initialized: "{requestCreator} would like to initiate a trade with {target}.",
  },
  Train: {
    Con: "Your constitution grows!",
    Dex: "Your dexterity increases!",
    Hp: "Your hp increases!",
    Info: "You can train: {0}hp mana mv",
    Int: "You gain in intelligence!",
    Mana: "Your mana increases!",
    Mv: "Your movement increases!",
    Sta: "Your stamina increases!",
    Str: "You become stronger!",
    Wis: "Your wisdom increases!",
  },
  Unlock: {
    Success: "{requestCreator} {unlockVerb} a {door} {direction}.",
  },
  Wake: {
    CannotWakeUp: "You cannot wake up.",
    Success: "{requestCreator} {verb} and {verb2} up.",
  },
  Wear: {
    Success: "{requestCreator}{removeClause} {verb} {item}.",
  },
  Wimpy: {
    Success: "Wimpy is now set to {0}.",
    TooHigh: "That wimpy is too high. It must be below {0}.",
  },
}

export const MESSAGE_FAIL_CONTAINER_NOT_FOUND = "That container isn't here."
export const MESSAGE_FAIL_NOT_FIGHTING = "You're not fighting anyone."
export const MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE = "You don't see any directions to flee."
export const MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE = "You cannot get that."
export const MESSAGE_DIRECTION_DOES_NOT_EXIST = "Alas, that direction does not exist."
export const MESSAGE_OUT_OF_MOVEMENT = "You are too tired."
export const MESSAGE_REMOVE_FAIL = "You aren't wearing that."
export const MESSAGE_FAIL_ALREADY_AWAKE = "You're already awake."
export const MESSAGE_FAIL_CONTAINER_NOT_EMPTY = "That is not empty."

export const ConditionMessages = {
  All: {
    Arguments: {
      Buy: "What do you want to buy?",
      Cast: "What do you want to cast?",
      Close: "What do you want to close?",
      Drop: "What would you like to drop?",
      Eat: "What would you like to eat?",
      Lock: "What do you want to lock?",
      Open: "What do you want to open?",
      Unlock: "What do you want to unlock?",
    },
    Disposition: "You must be standing to do that",
    Item: {
      CannotRemoveCursedItem: "{0} is cursed and binds to your flesh.",
      CannotSacrifice: "You cannot sacrifice that.",
      NoMerchant: "You don't see a merchant anywhere.",
      NoRemoveItem: "{0} cannot be removed.",
      NotEquipment: "That is not equipment.",
      NotFound: "You don't see that anywhere.",
      NotOwned: "You don't have that.",
      NotTransferrable: "{0} is not transferrable.",
    },
    MalformedInput: "What was that?",
    Mob: {
      CannotAttackSelf: "No way! You can't attacks yourself.",
      Fighting: "No way! You are fighting.",
      NotFound: "They aren't here.",
    },
  },
  Buy: {
    CannotAfford: "You can't afford it.",
    MerchantNoItem: "They don't have that.",
  },
  Cast: {
    NotASpell: "That has not a spell.",
    SpellNotKnown: "You lack that spell.",
  },
  Close: {
    Fail: {
      AlreadyClosed: "That has already closed.",
      CannotClose: "You cannot close that.",
      ItemIsNotAContainer: "You can't close that.",
      NotFound: "You can't find that anywhere.",
    },
  },
  Eat: {
    AlreadyFull: "You are too full to eat more.",
    NotFood: "You can't eat that.",
  },
  Garotte: {
    Fail: "{requestCreator} {verb} to sneak up on {target}.",
    Success: "{target} {verb} out from suffocation.",
  },
  Hamstring: {
    Fail: "{requestCreator} {verb} to hamstring {target} but {verb2}.",
    Success: "{requestCreator} {verb} {target} hamstring! {target2} can barely move!",
  },
  Heal: {
    Fail: {
      CannotAffordSpell: "You can't afford that.",
      HealerNotFound: "A healer isn't here.",
      NotASpell: "They don't know that spell.",
    },
  },
  Lock: {
    Fail: {
      AlreadyLocked: "That has already locked.",
      NoKey: "You lack the key.",
    },
    Success: "{0} lock a {1}.",
  },
  Lore: {
    FailNotIdentified: "{item} has not identified yet.",
  },
  Move: {
    Fail: {
      DirectionDoesNotExist: "Alas, that direction does not exist.",
      DoorIsClosed: "The door has closed.",
      Immobilized: "You are immobilized and cannot move.",
      OutOfMovement: "You are too tired.",
    },
  },
  Open: {
    Fail: {
      AlreadyOpen: "That has already open.",
      Locked: "That has locked.",
      NotAContainer: "That's not a container.",
      NotFound: "You can't find that.",
    },
  },
  Quit: {
    CannotQuitWhileFighting: "You cannot quit while fighting.",
  },
  Remove: {
    Success: "{requestCreator} {verb} {item} and {verb2} it in {requestCreator2} inventory.",
  },
  Scan: {
    NoSubject: "For whom would you like to scan?",
  },
  Sit: {
    AlreadySitting: "You are already sitting.",
  },
  Sleep: {
    AlreadySleeping: "You are already asleep.",
  },
  Social: {
    LackingStanding: "You need to cool off before doing that.",
  },
  Train: {
    CannotTrainMore: "You can't train that anymore.",
    LackingTrains: "You need more training sessions first.",
    NoTrainer: "No trainer has here.",
    NotStanding: "You must be standing to train.",
  },
  Unlock: {
    Fail: {
      AlreadyUnlocked: "That has already unlocked.",
      NoKey: "You lack the key.",
      NotFound: "You can't find that.",
    },
  },
}
export const MESSAGE_FAIL_ALREADY_BANNED = "They are already banned."
export const MESSAGE_FAIL_CANNOT_BAN_ADMIN_ACCOUNTS = "You cannot ban admin accounts."
export const MESSAGE_FAIL_NOT_BANNED = "They are not banned."
export const MESSAGE_FAIL_CANNOT_UNBAN_ADMIN_ACCOUNTS = "You cannot un-ban admin accounts."
export const MESSAGE_FAIL_BANNED = "They are banned and cannot be promoted."
export const MESSAGE_FAIL_CANNOT_PROMOTE_IMMORTALS = "There has nothing beyond immortals."
export const MESSAGE_FAIL_CANNOT_DEMOTE_IMMORTALS = "Immortals cannot be demoted."

export const HelpMessages = {
  Cast: `Before you can cast a spell, you have to practice it.  The more you practice,
the higher chance you have of success when casting.  Casting spells costs mana.
The mana cost decreases as your level increases.

The <target> is optional.  Many spells which need targets will use an
appropriate default target, especially during combat.

If the spell name is more than one word, then you must quote the spell name.
Example: cast 'cure critic' frag.  Quoting is optional for single-word spells.
You can abbreviate the spell name.

When you cast an offensive spell, the victim usually gets a saving throw.
The effect of the spell is reduced or eliminated if the victim makes the
saving throw successfully.

See also the help sections for individual spells.`,
  CcAdd: `Add a credit card for subscription purposes. Here are some examples:
cc-add debit 4141414141414141 01 20
cc-add 'my cc' 4444444444444444 11 19`,
  CcList: `List cards available for subscription payments.`,
  CcRemove: `Remove a credit card by its short name. Examples include:
cc-remove 'bank card'
cc-remove cc1`,
  ChangeDisposition: `These commands change your position.  When you SIT or SLEEP, you
regenerate hit points, mana points, and movement points faster.
However, you are more vulnerable to attack, and if you SLEEP,
you won't hear many things happen.

Use WAKE to come back to a standing position.  You can
also WAKE other sleeping characters.`,
  Flee: `Once you start a fight, you can't just walk away from it.  If the fight
is not going well, you can attempt to FLEE, or another character can
RESCUE you.  (You can also RECALL, but this is less likely to work,
and costs more experience points, then fleeing).

If you lose your link during a fight, then your character will keep
fighting, and will attempt to RECALL from time to time.  Your chances
of making the recall are reduced, and you will lose much more experience.`,
  Subscribe: `Start a $3.00 monthly subscription to ${MudName}. You can 'unsubscribe'
at any time.`,
  Unsubscribe: `Cancel an active subscription. You can 'subscribe' again at any time.`,
}
