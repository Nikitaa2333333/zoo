# Data Schema: LitePMS Integration

## Input: LitePMS API / Widget Data
We need to fetch the following structure to update price cards:
```json
{
  "room_types": [
    {
      "id": "string",
      "name": "string",
      "current_price": "number",
      "currency": "RUB",
      "availability": "boolean",
      "description": "string"
    }
  ]
}
```

## Output: Website UI Cards
The cards on the landing page will react to the data:
- `card_id`: Matches `room_type_id`.
- `price_display`: Dynamic text reflecting `current_price`.
- `booking_link`: Link to the LitePMS widget with pre-selected room.

## Payload Shape (Payload confirmed)
All data transformations will pass through a `normalize_prices.py` script (if using API) or directly via LitePMS JS Widget.
