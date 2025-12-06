import { Injectable, Scope, Module, Provider, INestApplication } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
  tenantId?: string;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

@Injectable({ scope: Scope.REQUEST })
export class TenantProvider {
  get tenantId(): string | undefined {
    return asyncLocalStorage.getStore()?.tenantId;
  }

  set tenantId(id: string | undefined) {
    const store = asyncLocalStorage.getStore();
    if (store) {
      store.tenantId = id;
    }
  }

  static runWithTenant<T>(tenantId: string | undefined, fn: () => T): T {
    const store = asyncLocalStorage.getStore() || {}; // Ensure a store exists
    return asyncLocalStorage.run({ ...store, tenantId }, fn);
  }
}

// Provider for AsyncLocalStorage to be accessible
const ASYNC_LOCAL_STORAGE_PROVIDER: Provider = {
  provide: AsyncLocalStorage,
  useValue: asyncLocalStorage,
};

@Module({
  providers: [TenantProvider, ASYNC_LOCAL_STORAGE_PROVIDER],
  exports: [TenantProvider, ASYNC_LOCAL_STORAGE_PROVIDER],
})
export class TenantModule {}
