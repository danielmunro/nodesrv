import Maybe from "../../support/functional/maybe"

export interface DamageDescriptor {
  readonly damage: number,
  readonly descriptors: string[],
}

function newDamageDescriptor(damage: number, descriptors: string[]): DamageDescriptor {
  return { damage, descriptors }
}

export function getPhysicalDamageDescriptor(damage: number): string[] {
  return new Maybe(physicalDamage.find(m => damage <= m.damage))
    .do(m => m.descriptors)
    .or(() => ["masterful", "does UNSPEAKABLE things to", "!"])
    .get()
}

export function getMagicDamageDescriptor(damage: number): string[] {
  return new Maybe(magicDamage.find(m => damage <= m.damage))
    .do(m => m.descriptors)
    .or(() => ["do {RUNSPEAKABLE{x things to", "does {RUNSPEAKABLE{x things to"])
    .get()
}

const physicalDamage = [
  newDamageDescriptor(0, ["clumsy", "misses", " harmlessly."]),
  newDamageDescriptor(4, ["clumsy", "gives", " a bruise."]),
  newDamageDescriptor(8, ["wobbly", "hits", " making scrapes."]),
  newDamageDescriptor(12, ["lucky", "hits", " causing scratches."]),
  newDamageDescriptor(16, ["amateur", "hits", " causing light wounds."]),
  newDamageDescriptor(20, ["amateur", "strikes", ", the wound bleeds."]),
  newDamageDescriptor(26, ["competent", "strikes", ", hitting an organ."]),
  newDamageDescriptor(32, ["competent", "causes", " to gasp in pain."]),
  newDamageDescriptor(38, ["skillful", "causes", " harm!"]),
  newDamageDescriptor(44, ["skillful", "has a devastating effect on", "."]),
  newDamageDescriptor(50, ["cunning", "tears into", ", shredding flesh."]),
  newDamageDescriptor(60, ["strong", "causes", " to spurt blood!"]),
  newDamageDescriptor(70, ["calculated", "leaves large gashes on", "!"]),
  newDamageDescriptor(80, ["calculated", "tears", " leaving a GAPING hole!"]),
  newDamageDescriptor(87, ["well aimed", "DISEMBOWELS", ". Guts spill out!!"]),
  newDamageDescriptor(94, ["calm", "DISMEMBERS", "! Blood splatters!"]),
  newDamageDescriptor(105, ["wicked", "ANNIHILATES", "!!"]),
  newDamageDescriptor(117, ["wicked", "OBLITERATES", " completely!!"]),
  newDamageDescriptor(125, ["barbaric", "MASSACRES", ". Blood flies!"]),
  newDamageDescriptor(130, ["controlled", "ERADICATES", " to bits!!"]),
]

const magicDamage = [
  newDamageDescriptor(0, ["miss", "misses"]),
  newDamageDescriptor(4, ["scratch", "scratches"]),
  newDamageDescriptor(8, ["graze", "grazes"]),
  newDamageDescriptor(12, ["hit", "hits"]),
  newDamageDescriptor(16, ["injure", "injures"]),
  newDamageDescriptor(20, ["wound", "wounds"]),
  newDamageDescriptor(24, ["maul", "mauls"]),
  newDamageDescriptor(28, ["decimate", "decimates"]),
  newDamageDescriptor(32, ["devastate", "devastates"]),
  newDamageDescriptor(36, ["maim", "maims"]),
  newDamageDescriptor(40, ["MUTILATE", "MUTILATES"]),
  newDamageDescriptor(44, ["DISEMBOWEL", "DISEMBOWELS"]),
  newDamageDescriptor(48, ["DISMEMBER", "DISMEMBERS"]),
  newDamageDescriptor(52, ["MASSACRE", "MASSACRES"]),
  newDamageDescriptor(56, ["MANGLE", "MANGLES"]),
  newDamageDescriptor(60, ["*** DEMOLISH ***", "*** DEMOLISHES ***"]),
  newDamageDescriptor(75, ["*** DEVASTATE ***", "*** DEVASTATES ***"]),
  newDamageDescriptor(100, ["=== OBLITERATE ===", "=== OBLITERATES ==="]),
  newDamageDescriptor(125, [">>> ANNIHILATE <<<", ">>> ANNIHILATES <<<"]),
  newDamageDescriptor(150, ["<<< ERADICATE >>>", "<<< ERADICATES >>>"]),
]
