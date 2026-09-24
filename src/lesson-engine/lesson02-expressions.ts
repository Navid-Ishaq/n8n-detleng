export const lesson02Expressions = {
  name: "{{ $json.customer.name || $json.customer.fullName || 'Unknown' }}",
  country: "{{ $json.customer.country || 'Unknown' }}",
  id: '{{ $json.order.id }}',
  count: '{{ Array.isArray($json.order.items) ? $json.order.items.length : 0 }}',
  total: '{{ Array.isArray($json.order.items) ? $json.order.items.reduce((total, item) => total + (item.qty * item.price), 0) : 0 }}',
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
