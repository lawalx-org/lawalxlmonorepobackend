import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

interface NotificationJobData {
  userId: string;
  message: string;
}

@Processor('notification')
export class NotificationProcessor extends WorkerHost {
  async process(job: Job<NotificationJobData>): Promise<void> {
    const { userId, message } = job.data;
    // Send your notification (email, SMS, push)
    console.log(`Sending to ${userId}: ${message}`);
  }
}
