import Maybe from "./maybe"

export type DoType = (thing: any) => any
export type AsyncDoType = (thing: any) => Promise<any>
export type OrType = () => any
export type MaybeResult = Maybe<any>
export type Thing = any
