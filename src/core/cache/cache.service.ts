import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  async get(
    key: string,
    fallback?: () => Promise<any>,
    ttl: number = 0,
  ): Promise<any> {
    const result = await this.cacheManager.get(key);
    if (result) {
      this.logger.debug('FROM CACHE', key);
      return result;
    }
    if (fallback) {
      const resultFromFallback = await fallback();
      if (resultFromFallback) {
        this.logger.debug('FROM FALLBACK', key);
        await this.cacheManager.set(key, resultFromFallback, ttl);
        return resultFromFallback;
      }
    }
    return null;
  }

  del(key: string) {
    return this.cacheManager.del(key);
  }

  reset() {
    return this.cacheManager.reset();
  }
}
