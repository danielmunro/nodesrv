import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Mob } from "../../mob/model/mob"
import { SpellType } from "../spellType"

@Entity()
export class Spell {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  public spellType: SpellType

  @Column("integer")
  public level: number = 1

  @ManyToOne((type) => Mob, (mob) => mob.spells)
  public mob: Mob
}
