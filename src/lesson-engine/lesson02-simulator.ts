export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

export const canonicalOrder = {
  customer: { name: 'Ali Khan', country: 'ES' },
  order: {
    id: 'ORD-101',
    items: [
      { name: 'Keyboard', qty: 2, price: 50 },
      { name: 'Mouse', qty: 1, price: 25 },
    ],
  },
} as const

export const variableOrder = {
  customer: { name: 'Lara Gomez', country: 'PT' },
  order: {
    id: 'ORD-202',
    items: [
      { name: 'Monitor', qty: 1, price: 180 },
      { name: 'Cable', qty: 3, price: 10 },
      { name: 'Stand', qty: 2, price: 25 },
    ],
  },
} as const

export type OrderPayload = {
  readonly customer: { readonly name?: string; readonly fullName?: string; readonly country?: string | null }
  readonly order: { readonly id: string; readonly items: readonly { readonly name: string; readonly qty: number; readonly price: number }[] }
}

export function pathSegments(path: string): Array<string | number> {
  return path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean).map((part) => /^\d+$/.test(part) ? Number(part) : part)
}

export function resolveJsonPath(value: unknown, path: string): unknown {
  return pathSegments(path).reduce<unknown>((current, segment) => {
    if (current == null || typeof current !== 'object') return undefined
    return (current as Record<string | number, unknown>)[segment]
  }, value)
}

export function jsonType(value: unknown) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value === 'object' ? 'object' : typeof value
}

export function normalizeOrder(payload: OrderPayload, defensiveName = false) {
  const items = Array.isArray(payload.order?.items) ? payload.order.items : []
  return {
    customerName: defensiveName ? payload.customer?.name ?? payload.customer?.fullName ?? null : payload.customer?.name ?? null,
    customerCountry: payload.customer?.country ?? null,
    orderId: payload.order?.id ?? null,
    itemCount: items.length,
    orderTotal: items.reduce((sum, item) => sum + item.qty * item.price, 0),
  }
}

export function splitOrderItems(payload: OrderPayload) {
  return Array.isArray(payload.order?.items) ? payload.order.items.map((item) => ({ ...item })) : []
}

export function hasFinalProductionShape(nodes: string[]) {
  return nodes.join(' → ') === 'Webhook → Normalize Order → HTTP Response'
}
