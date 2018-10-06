export const Messages = {
  Bash: {
    Fail: "You fall flat on your face!",
    NoSkill: "You bash around helplessly.",
    Success: `You slam into {0} and send them flying!`,
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
    Fail: "You fail to envenom {0}.",
    Success: "You successfully envenom {0}.",
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
    Mana: 100,
  },
  Sneak: {
    Delay: 1,
    Mv: 5,
  },
  Trip: {
    Delay: 1,
    Mv: 5,
  },
}

export const SuccessThreshold = {
  EnhancedDamage: 60,
}
