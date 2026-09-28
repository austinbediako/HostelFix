import { logger } from '../config/logger.js';

export interface Job {
  type: string;
  payload: unknown;
}

export interface JobQueue {
  enqueue(type: string, payload: unknown): void;
  registerWorker(type: string, worker: (payload: unknown) => Promise<void>): void;
  start(): void;
  stop(): Promise<void>;
}

export class InMemoryQueue implements JobQueue {
  private jobs: Job[] = [];
  private workers = new Map<string, (payload: unknown) => Promise<void>>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;

  enqueue(type: string, payload: unknown): void {
    this.jobs.push({ type, payload });
  }

  registerWorker(type: string, worker: (payload: unknown) => Promise<void>): void {
    this.workers.set(type, worker);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.timer = setInterval(() => this.processBatch(), 1000);
  }

  stop(): Promise<void> {
    if (this.timer) clearInterval(this.timer);
    this.running = false;
    return Promise.resolve();
  }

  private async processBatch(): Promise<void> {
    if (this.jobs.length === 0) return;
    const batch = this.jobs.splice(0, this.jobs.length);
    for (const job of batch) {
      const worker = this.workers.get(job.type);
      if (!worker) {
        logger.warn({ jobType: job.type }, 'No worker registered for job type');
        continue;
      }
      try {
        await worker(job.payload);
      } catch (err) {
        logger.error({ err, job }, 'Job worker failed');
      }
    }
  }
}

export const jobQueue = new InMemoryQueue();
