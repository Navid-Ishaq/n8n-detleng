import { describe, expect, it } from 'vitest'
import { canonicalOrder, hasFinalProductionShape, normalizeOrder, resolveJsonPath, splitOrderItems, variableOrder } from './lesson02-simulator'

describe('Lesson 02 JSON teaching twin', () => {
  it('resolves nested object and array paths', () => {
    expect(resolveJsonPath(canonicalOrder, 'customer.name')).toBe('Ali Khan')
    expect(resolveJsonPath(canonicalOrder, 'order.items[0].price')).toBe(50)
  })

  it('normalizes canonical, variable and missing-country payloads', () => {
    expect(normalizeOrder(canonicalOrder)).toEqual({ customerName: 'Ali Khan', customerCountry: 'ES', orderId: 'ORD-101', itemCount: 2, orderTotal: 125 })
    expect(normalizeOrder(variableOrder)).toMatchObject({ customerName: 'Lara Gomez', itemCount: 3, orderTotal: 260 })
    expect(normalizeOrder({ ...canonicalOrder, customer: { name: 'Ali Khan' } })).toMatchObject({ customerCountry: null })
  })

  it('splits the learning array without changing final production architecture', () => {
    expect(splitOrderItems(canonicalOrder)).toHaveLength(2)
    expect(splitOrderItems(canonicalOrder)[0].name).toBe('Keyboard')
    expect(hasFinalProductionShape(['Webhook', 'Normalize Order', 'HTTP Response'])).toBe(true)
    expect(hasFinalProductionShape(['Webhook', 'Split Out', 'Normalize Order', 'HTTP Response'])).toBe(false)
  })

  it('shows schema drift, then supports both names after repair', () => {
    const changed = { ...canonicalOrder, customer: { fullName: 'Ali Khan', country: 'ES' } }
    expect(normalizeOrder(changed).customerName).toBeNull()
    expect(normalizeOrder(changed, true).customerName).toBe('Ali Khan')
    expect(normalizeOrder(canonicalOrder, true).customerName).toBe('Ali Khan')
  })
})
