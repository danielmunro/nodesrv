import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { MobEntity } from "../../mob/entity/mobEntity"
import { SkillType } from "../skillType"

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  public skillType: SkillType

  @Column("integer")
  public level: number = 1

  @Column("integer")
  public levelObtained: number

  @ManyToOne(() => MobEntity, mob => mob.skills)
  public mob: MobEntity

  public toString(): string {
    return this.skillType
  }
}
