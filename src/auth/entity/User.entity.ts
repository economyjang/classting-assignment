import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../../../types/UserType';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    email_id: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column()
    type: UserType;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    setEmailId(emailId: string) {
        this.email_id = emailId;
        return this;
    }

    setPassword(password: string) {
        this.password = password;
        return this;
    }

    setName(name: string) {
        this.name = name;
        return this;
    }

    setType(type: UserType) {
        this.type = type;
        return this;
    }
}
