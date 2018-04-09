import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Mob } from "../../mob/model/mob"
import { AffectType } from "../affectType"

@Entity()
export class Affect {
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne((type) => Mob, (mob) => mob.affects)
  public mob: Mob

  @Column("text")
  public affectType: AffectType

  @Column("integer")
  public timeout: number
}
