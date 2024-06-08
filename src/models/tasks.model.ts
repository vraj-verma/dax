import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';


@Entity()
export class Tasks {

    @PrimaryGeneratedColumn()
    task_id?: number;

    @Column()
    task: string;

    @Column()
    description: string;

    @Column()
    user_id: number;

    @Column()
    org_id: number;

    @Column()
    account_id: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date;

}
