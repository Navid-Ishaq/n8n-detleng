export function createControlledTools() {
  return Object.freeze({
    lookup_customer: async ({ customer = 'Demo Customer' } = {}) => ({ customer, accountStatus: 'active', environment: 'portfolio-sandbox' }),
    lookup_policy: async ({ sourceId } = {}) => ({ sourceId, permission: 'read_only' }),
    check_service_health: async ({ attempt, failCount }) => attempt <= failCount ? { ok: false, status: 503 } : { ok: true, status: 200 },
    simulate_action: async ({ actionType, receipt }) => ({ executed: true, actionType, receipt, environment: 'portfolio-sandbox', executedAt: new Date().toISOString() }),
  })
}
