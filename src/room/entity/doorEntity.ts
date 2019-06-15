import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"
import {LockpickDifficulty} from "../enum/lockpickDifficulty"

@Entity()
export default class DoorEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public canonicalId: number

  @Column()
  public name: string

  @Column()
  public unlockedByCanonicalId: number

  @Column()
  public isClosed: boolean

  @Column()
  public isLocked: boolean

  @Column()
  public isPickproof: boolean

  @Column("integer")
  public lockpickDifficulty: LockpickDifficulty

  @Column()
  public noClose: boolean

  @Column()
  public noLock: boolean

  @Column()
  public isConcealed: boolean
}
