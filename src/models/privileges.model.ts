import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';


@Entity()
export class Privileges {

    @PrimaryGeneratedColumn()
    privileged_id: number;

    // @Column()
    // user_id: number;

    @Column({ default: false })
    create?: boolean;

    @Column({ default: true })
    read: boolean;

    @Column({ default: false })
    update?: boolean;

    @Column({ default: false })
    delete?: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date;
}
