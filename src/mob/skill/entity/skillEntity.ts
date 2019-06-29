import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { MobEntity } from "../../entity/mobEntity"
import { SkillType } from "../skillType"

@Entity()
export class SkillEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  public skillType: SkillType

  @Column({ default: 1 })
  public level: number

  @Column()
  public levelObtained: number

  @ManyToOne(() => MobEntity, mob => mob.skills)
  public mob: MobEntity

  public toString(): string {
    return this.skillType
  }
}
