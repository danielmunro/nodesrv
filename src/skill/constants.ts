export const Messages = {
  Bash: {
    Fail: "{requestCreator} {verb} flat on {requestCreator2} face!",
    NoSkill: "You bash around helplessly.",
    Success: "{requestCreator} {verb} into {target} and {verb2} {target2} flying!",
  },
  Berserk: {
    Fail: "You fail to summon your inner rage.",
    Success: "Your pulse speeds up as you are consumed by rage!",
  },
  DirtKick: {
    Fail: "You kick dirt and miss {0}!",
    Success: "You kick dirt right in {0}'s eyes!",
  },
  Envenom: {
    Error: {
      NotAWeapon: "That's not a weapon.",
      WrongWeaponType: "You need a piercing or slashing weapon",
    },
    Fail: "You fail to envenom {item}.",
    Success: "You successfully envenom {item}.",
  },
  Sneak: {
    Fail: "You fail to move silently.",
    Success: "You begin to move silently.",
  },
}

export const Costs = {
  Backstab: {
    Delay: 2,
    Mv: 80,
  },
  Bash: {
    Delay: 2,
    Mv: 40,
  },
  Berserk: {
    Delay: 2,
    Mv: 80,
  },
  DirtKick: {
    Delay: 1,
    Mv: 10,
  },
  Disarm: {
    Delay: 2,
    Mv: 20,
  },
  Envenom: {
    Delay: 2,
    Mana: 100,
  },
  Hamstring: {
    Delay: 2,
    Mana: 100,
    Mv: 100,
  },
  Sharpen: {
    Delay: 2,
    Mana: 50,
    Mv: 50,
  },
  Sneak: {
    Delay: 1,
    Mv: 5,
  },
  Steal: {
    Delay: 2,
    Mv: 40,
  },
  Trip: {
    Delay: 1,
    Mv: 5,
  },
}

export const SuccessThreshold = {
  EnhancedDamage: 60,
}
export const BASE_IMPROVE_CHANCE = 50
export const ConditionMessages = {
  All: {
    Fighting: "You are fighting!",
    NoItem: "You don't have that.",
    NoSkill: "You lack the skill.",
    NoSpell: "You lack that spell.",
    NoTarget: "You need a target!",
    NotEnoughExperience: "You don't have the required experience.",
    NotEnoughMana: "You lack the mana.",
    NotEnoughMv: "You are too tired.",
  },
  Berserk: {
    FailAlreadyInvoked: "You are already at an elevated level of battle readiness.",
  },
  Disarm: {
    FailNothingToDisarm: "They don't have a weapon to disarm.",
  },
  Sharpen: {
    AlreadySharpened: "That is already sharpened.",
    NotABladedWeapon: "That weapon needs a blade to sharpen.",
    NotAWeapon: "That is not a weapon.",
  },
  Steal: {
    ErrorNoItem: "They don't have that.",
  },
}
const defaultSuccess = "{requestCreator} {verb} {target}!"
export const ActionMessages = {
  Backstab: {
    Failure: "{target} {verb} {requestCreator} backstab!",
    Success: defaultSuccess,
  },
  Disarm: {
    Failure: "{requestCreator} {verb} to disarm {target}.",
    Success: "{requestCreator} {verb} {target} and send {gender} weapon flying!",
  },
  Sharpen: {
    Failure: "{requestCreator} {verb} to sharpen {target}.",
    Success: defaultSuccess,
  },
  Steal: {
    Failure: "{requestCreator} {verb} to steal {item} from {target}.",
    Success: "{requestCreator} {verb} {item} from {target}!",
  },
  Trip: {
    Failure: "{requestCreator} {verb} to trip {target}!",
    Success: defaultSuccess,
  },
}
export const Thresholds = {
  Backstab: 60,
  Berserk: 60,
  DirtKick: 60,
  Disarm: 70,
  FastHealing: 50,
  Sharpen: 10,
  Sneak: 50,
}
