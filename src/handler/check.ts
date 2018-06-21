export enum CheckStatus {
  Ok,
  Failed,
}

export default class Check {
  constructor(
    readonly status: CheckStatus,
    readonly message: string,
  ) {}
}
