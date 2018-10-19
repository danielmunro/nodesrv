export const Messages = {
  Backstab: {
    Failure: "{target} dodges {requestCreator} backstab!",
    Success: "{requestCreator} {verb} {target}!",
  },
  Disarm: {
    Failure: "{requestCreator} {verb} to disarm {target}.",
    Success: "{requestCreator} {verb} {target} and send {gender} weapon flying!",
  },
  Steal: {
    Failure: "{requestCreator} {verb} to steal {item} from {target}.",
    Success: "{requestCreator} {verb} {item} from {target}!",
  },
  Trip: {
    Failure: "{requestCreator} {verb} to trip {target}!",
    Success: "{requestCreator} {verb} {target}!",
  },
}

export const Thresholds = {
  Backstab: 60,
  Berserk: 60,
  DirtKick: 60,
  Disarm: 70,
  FastHealing: 50,
  Sneak: 50,
}
