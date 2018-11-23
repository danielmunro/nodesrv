export enum Standing {
  Good = "good",
  Trusted = "trusted",
  Cooloff = "cooloff",
  IndefiniteBan = "indefinite ban",
  PermaBan = "permanent ban",
}

const banned = [
  Standing.Cooloff,
  Standing.IndefiniteBan,
  Standing.PermaBan,
]

export function isBanned(standing: Standing): boolean {
  return banned.includes(standing)
}
