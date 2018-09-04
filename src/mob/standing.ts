export enum Standing {
  Good = "good",
  Trusted = "trusted",
  Cooloff = "cooloff",
  IndefiniteBan = "indefinite ban",
  PermaBan = "permanent ban",
}

export function isBanned(standing: Standing): boolean {
  return standing > Standing.Cooloff
}
