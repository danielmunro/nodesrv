import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"
import {LockpickDifficulty} from "../enum/lockpickDifficulty"

@Entity()
export default class DoorEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("integer")
  public canonicalId: number

  @Column("text")
  public name: string

  @Column("integer")
  public unlockedByCanonicalId: number

  @Column("boolean")
  public isClosed: boolean

  @Column("boolean")
  public isLocked: boolean

  @Column("boolean")
  public isPickproof: boolean

  @Column("integer")
  public lockpickDifficulty: LockpickDifficulty

  @Column("boolean")
  public noClose: boolean

  @Column("boolean")
  public noLock: boolean

  @Column("boolean")
  public isConcealed: boolean
}
