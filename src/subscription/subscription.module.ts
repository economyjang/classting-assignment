import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entity/Subscription.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Subscription])],
    providers: [SubscriptionService],
    controllers: [SubscriptionController],
    exports: [SubscriptionService],
})
export class SubscriptionModule {}
