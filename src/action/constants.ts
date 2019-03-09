export const MAX_TRAINABLE_STATS = 4
export const FLEE_MOVEMENT_COST_MULTIPLIER = 3
export const Messages = {
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
    NotACorpse: "That is not a corpse.",
  },
  Lore: {
    Success: "{item} details:\nlevel: {level}  weight: {weight}  value: {value}",
  },
  OpenContainer: {
    Success: "{requestCreator} {openVerb} {item}.",
  },
  OpenDoor: {
    Success: "{requestCreator} {openVerb} a {door} {direction}.",
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
  Sacrifice: {
    Success: "You sacrifice {0} to your deity, and are rewarded with {1} gold.",
  },
  Sell: {
    Success: "You sell {0} for {1} gold",
  },
  ShieldBash: {
    Fail: "{requestCreator} {verb} to shield bash {target} but {verb2}.",
    Success: "{requestCreator} {verb} {target} in the face with {requestCreator2} shield.",
  },
  Sleep: {
    Success: "You lay down and go to sleep.",
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
    Success: "You wake and stand up.",
  },
}

export const MESSAGE_FAIL_CONTAINER_NOT_FOUND = "That container isn't here."
export const MESSAGE_FAIL_NOT_FIGHTING = "You're not fighting anyone."
export const MESSAGE_FAIL_NO_DIRECTIONS_TO_FLEE = "You don't see any directions to flee."
export const MESSAGE_FAIL_TOO_TIRED = "You are too tired to flee."
export const MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE = "You cannot get that."
export const MESSAGE_FAIL_KILL_NO_TARGET = "Who would you like to kill?"
export const MESSAGE_FAIL_KILL_ALREADY_FIGHTING = "No way! You are already fighting."
export const MESSAGE_FAIL_CANNOT_ATTACK_SELF = "No way! You can't attacks yourself."
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
      NotFound: "They aren't here.",
    },
  },
  Buy: {
    CannotAfford: "You can't afford it.",
    MerchantNoItem: "They don't have that.",
  },
  Cast: {
    NotASpell: "That is not a spell.",
    SpellNotKnown: "You lack that spell.",
  },
  Close: {
    Fail: {
      AlreadyClosed: "That is already closed.",
      CannotClose: "You cannot close that.",
      ItemIsNotAContainer: "You can't close that.",
      NotFound: "You can't find that anywhere.",
    },
  },
  Eat: {
    AlreadyFull: "You are too full to eat more.",
    NotFood: "You can't eat that.",
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
      DirectionDoesNotExist: "Alas, that direction does not exist.",
      DoorIsClosed: "The door is closed.",
      Immobilized: "You are immobilized and cannot move.",
      OutOfMovement: "You are too tired.",
    },
  },
  Open: {
    Fail: {
      AlreadyOpen: "That is already open.",
      Locked: "That is locked.",
      NotAContainer: "That's not a container.",
      NotFound: "You can't find that.",
    },
  },
  Remove: {
    Success: "You remove {0} and put it in your inventory.",
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
    NoTrainer: "No trainer is here.",
    NotStanding: "You must be standing to train.",
  },
  Unlock: {
    Fail: {
      AlreadyUnlocked: "That is already unlocked.",
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
export const MESSAGE_FAIL_CANNOT_PROMOTE_IMMORTALS = "There is nothing beyond immortals."
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
  ChangeDisposition: `These commands change your position.  When you REST or SLEEP, you
regenerate hit points, mana points, and movement points faster.
However, you are more vulnerable to attack, and if you SLEEP,
you won't hear many things happen.

Use STAND or WAKE to come back to a standing position.  You can
also WAKE other sleeping characters.`,
  Flee: `Once you start a fight, you can't just walk away from it.  If the fight
is not going well, you can attempt to FLEE, or another character can
RESCUE you.  (You can also RECALL, but this is less likely to work,
and costs more experience points, then fleeing).

If you lose your link during a fight, then your character will keep
fighting, and will attempt to RECALL from time to time.  Your chances
of making the recall are reduced, and you will lose much more experience.`,
}
