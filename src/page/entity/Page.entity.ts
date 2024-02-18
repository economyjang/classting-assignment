import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entity/User.entity';

@Entity()
export class Page {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    region: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToOne(() => User)
    @JoinColumn()
    manager: User;

    setName(name: string) {
        this.name = name;
        return this;
    }

    setRegion(region: string) {
        this.region = region;
        return this;
    }

    setManager(manager: User) {
        this.manager = manager;
        return this;
    }
}
