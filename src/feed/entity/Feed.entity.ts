import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entity/User.entity';
import { News } from '../../news/entity/News.entity';

@Entity()
export class Feed {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, (user) => user.id)
    user: User;

    @ManyToOne(() => News, (news) => news.id)
    news: News;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    setUser(user: User) {
        this.user = user;
        return this;
    }

    setNews(news: News) {
        this.news = news;
        return this;
    }
}
