export const lesson02Expressions = {
  name: '{{ $json.body.customer.name ?? $json.body.customer.fullName }}',
  country: '{{ $json.body.customer.country ?? null }}',
  id: '{{ $json.body.order.id }}',
  count: '{{ $json.body.order.items.length }}',
  total: '{{ $json.body.order.items.reduce((sum, item) => sum + (item.qty * item.price), 0) }}',
}

export const lesson02NormalPayload = `{
  "customer": { "name": "Ali Khan", "country": "ES" },
  "order": {
    "id": "ORD-101",
    "items": [
      { "name": "Keyboard", "qty": 2, "price": 50 },
      { "name": "Mouse", "qty": 1, "price": 25 }
    ]
  }
}`

export const lesson02VariablePayload = `{
  "customer": { "name": "Sara Noor", "country": "DE" },
  "order": {
    "id": "ORD-202",
    "items": [
      { "name": "Monitor", "qty": 1, "price": 200 },
      { "name": "Cable", "qty": 2, "price": 15 },
      { "name": "Adapter", "qty": 3, "price": 10 }
    ]
  }
}`
