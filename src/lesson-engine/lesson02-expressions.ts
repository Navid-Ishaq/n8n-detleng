export const lesson02Expressions = {
  name: '{{ $json.body.customer.name }}',
  country: '{{ $json.body.customer.country ?? null }}',
  id: '{{ $json.body.order.id }}',
  count: '{{ $json.body.order.items.length }}',
  total: '{{ $json.body.order.items.reduce((sum, item) => sum + (item.qty * item.price), 0) }}',
  fallback: '{{ $json.body.customer.name || $json.body.customer.fullName || "Unknown" }}',
}
