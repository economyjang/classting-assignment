import { Injectable } from '@nestjs/common';
import { User } from '../auth/entity/User.entity';
import { Subscription } from './entity/Subscription.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
    ) {}

    async getMySubscribePages(user: User) {
        const result = await this.subscriptionRepository.find({
            where: { user: { id: user.id } },
            relations: { user: true, page: true },
        });
        return result.map((subscription) => subscription.page);
    }
}
