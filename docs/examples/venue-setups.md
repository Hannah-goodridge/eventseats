# Venue Setup Examples

Real-world examples of how different types of venues can configure their booking system.

## Small Community Theatre (50-100 seats)

### Venue Configuration
- **Layout**: Simple rows and columns
- **Seating**: 8 rows, 10 seats per row (80 total)
- **Pricing**: Adult, Child, Senior
- **Features**: Basic accessibility seating

### Typical Show Setup
```javascript
// Example show configuration
{
  "name": "A Midsummer Night's Dream",
  "description": "Shakespeare's beloved comedy...",
  "performances": [
    {
      "date": "2024-02-15",
      "time": "19:30",
      "doors": "19:00"
    },
    {
      "date": "2024-02-16",
      "time": "19:30",
      "doors": "19:00"
    },
    {
      "date": "2024-02-17",
      "time": "14:30",
      "doors": "14:00"
    }
  ],
  "pricing": {
    "adult": 15.00,
    "child": 8.00,
    "senior": 12.00
  },
  "seatingLayout": {
    "rows": 8,
    "seatsPerRow": 10,
    "accessibleSeats": ["A1", "A2", "H9", "H10"]
  }
}
```

### Cost Breakdown
- **Monthly hosting**: £0 (Vercel free tier)
- **Database**: £0 (Supabase free tier)
- **Domain**: £12/year
- **Payment processing**: 2.9% + 30p per transaction
- **Total monthly**: ~£1 + payment fees

---

## School Theatre (200+ seats)

### Venue Configuration
- **Layout**: Traditional theatre with stalls and balcony
- **Seating**:
  - Stalls: 12 rows × 16 seats = 192 seats
  - Balcony: 4 rows × 14 seats = 56 seats
  - Total: 248 seats
- **Pricing**: Student, Adult, Staff, Family packages
- **Features**: Wheelchair spaces, group booking support

### Typical Show Setup
```javascript
{
  "name": "School Production: Grease",
  "description": "Our Year 11 students present...",
  "performances": [
    {
      "date": "2024-03-20",
      "time": "19:00",
      "doors": "18:30",
      "type": "evening"
    },
    {
      "date": "2024-03-21",
      "time": "19:00",
      "doors": "18:30",
      "type": "evening"
    },
    {
      "date": "2024-03-22",
      "time": "14:00",
      "doors": "13:30",
      "type": "matinee"
    }
  ],
  "pricing": {
    "student": 5.00,
    "adult": 12.00,
    "staff": 8.00,
    "family": 35.00  // 2 adults + 2 students
  },
  "seatingLayout": {
    "sections": [
      {
        "name": "Stalls",
        "rows": 12,
        "seatsPerRow": 16,
        "priceMultiplier": 1.0
      },
      {
        "name": "Balcony",
        "rows": 4,
        "seatsPerRow": 14,
        "priceMultiplier": 0.8
      }
    ],
    "accessibleSeats": ["A1", "A2", "A15", "A16"],
    "companionSeats": ["A3", "A14"]
  },
  "groupBookingMinimum": 10,
  "groupBookingDiscount": 0.15
}
```

### Special Features
- Student ticket validation
- Family package deals
- Group booking management
- Staff discount codes

---

## Professional Regional Theatre (300-500 seats)

### Venue Configuration
- **Layout**: Traditional proscenium with premium seating
- **Seating**:
  - Premium: 2 rows × 20 seats = 40 seats
  - Stalls: 15 rows × 24 seats = 360 seats
  - Circle: 8 rows × 20 seats = 160 seats
  - Total: 560 seats
- **Pricing**: Multiple tiers with dynamic pricing
- **Features**: Premium experiences, interval ordering

### Typical Show Setup
```javascript
{
  "name": "The Lion King",
  "description": "Disney's award-winning musical...",
  "run": {
    "startDate": "2024-06-01",
    "endDate": "2024-08-31",
    "performanceDays": ["tuesday", "wednesday", "thursday", "friday", "saturday"],
    "matineeDays": ["wednesday", "saturday", "sunday"]
  },
  "pricing": {
    "premium": {
      "adult": 85.00,
      "child": 65.00,
      "senior": 75.00
    },
    "stalls": {
      "adult": 65.00,
      "child": 45.00,
      "senior": 55.00
    },
    "circle": {
      "adult": 45.00,
      "child": 35.00,
      "senior": 40.00
    }
  },
  "dynamicPricing": {
    "peakDates": ["2024-07-15", "2024-08-15"],
    "peakMultiplier": 1.2,
    "offPeakDays": ["tuesday", "wednesday"],
    "offPeakMultiplier": 0.9
  },
  "packages": [
    {
      "name": "Premium Experience",
      "includes": ["premium_seat", "interval_drinks", "programme"],
      "price": 95.00
    }
  ]
}
```

### Advanced Features
- Season subscriptions
- Loyalty programs
- Corporate bookings
- VIP packages

---

## Multi-Purpose Community Centre

### Venue Configuration
- **Layout**: Flexible seating arrangements
- **Capacity**: Variable (50-200 depending on setup)
- **Event Types**: Theatre, concerts, comedy, conferences
- **Pricing**: Event-specific

### Example Configurations

#### Theatre Setup (120 seats)
```javascript
{
  "layout": "theatre",
  "seatingArrangement": {
    "rows": 10,
    "seatsPerRow": 12,
    "stage": "front"
  },
  "pricing": {
    "adult": 18.00,
    "concession": 15.00
  }
}
```

#### Concert Setup (150 standing + 50 seated)
```javascript
{
  "layout": "concert",
  "areas": [
    {
      "name": "Standing",
      "capacity": 150,
      "pricing": {
        "adult": 25.00,
        "student": 20.00
      }
    },
    {
      "name": "Seated",
      "rows": 5,
      "seatsPerRow": 10,
      "pricing": {
        "adult": 30.00,
        "student": 25.00
      }
    }
  ]
}
```

#### Comedy Night Setup (80 cabaret style)
```javascript
{
  "layout": "cabaret",
  "tables": [
    {
      "tableNumber": 1,
      "seats": 4,
      "position": "front"
    },
    // ... 20 tables total
  ],
  "pricing": {
    "adult": 20.00,
    "student": 15.00
  },
  "minimumPerTable": 2
}
```

---

## Outdoor Theatre/Festival

### Venue Configuration
- **Layout**: Tiered outdoor seating
- **Weather dependent**: Rain policies
- **Seating**: Mix of fixed and bring-your-own
- **Special considerations**: Weather, accessibility

### Summer Festival Setup
```javascript
{
  "name": "Summer Shakespeare Festival",
  "venue": "Castle Grounds",
  "weatherPolicy": {
    "covered": false,
    "rainPolicy": "postpone",
    "cancelationNotice": 2, // hours
    "refundPolicy": "full"
  },
  "seatingOptions": [
    {
      "name": "Premium Seats",
      "description": "Padded chairs with backs",
      "quantity": 100,
      "pricing": {
        "adult": 25.00,
        "child": 15.00
      }
    },
    {
      "name": "Standard Seats",
      "description": "Bench seating",
      "quantity": 200,
      "pricing": {
        "adult": 18.00,
        "child": 12.00
      }
    },
    {
      "name": "Picnic Area",
      "description": "Bring your own blanket/chair",
      "quantity": 150,
      "pricing": {
        "adult": 12.00,
        "child": 8.00
      }
    }
  ],
  "additionalItems": [
    {
      "name": "Interval Picnic Box",
      "price": 8.00,
      "description": "Local produce picnic box"
    },
    {
      "name": "Car Parking",
      "price": 5.00,
      "required": false
    }
  ]
}
```

---

## Dinner Theatre

### Venue Configuration
- **Layout**: Tables with dinner service
- **Capacity**: 120 diners
- **Pricing**: All-inclusive packages
- **Special requirements**: Dietary needs, service timing

### Typical Setup
```javascript
{
  "name": "Murder Mystery Dinner",
  "format": "dinner_theatre",
  "serviceStyle": "three_course",
  "tables": [
    {
      "tableSize": 8,
      "quantity": 15,
      "location": "main_floor"
    }
  ],
  "packages": [
    {
      "name": "Standard Package",
      "includes": ["show", "three_course_meal", "welcome_drink"],
      "price": 45.00,
      "dietaryOptions": ["vegetarian", "vegan", "gluten_free"]
    },
    {
      "name": "Premium Package",
      "includes": ["show", "four_course_meal", "wine_pairing", "pre_show_reception"],
      "price": 65.00,
      "dietaryOptions": ["vegetarian", "vegan", "gluten_free"]
    }
  ],
  "timing": {
    "arrival": "18:30",
    "dinner": "19:00",
    "show": "20:30",
    "finish": "22:30"
  },
  "dietaryCollection": true,
  "tableAssignment": "automatic", // or "customer_choice"
  "minimumBooking": 2
}
```

---

## Configuration Tips

### For All Venues

1. **Start Simple**: Begin with basic seating and pricing, add complexity later
2. **Test Thoroughly**: Book test tickets to verify the customer experience
3. **Clear Policies**: Clearly state refund, exchange, and latecomer policies
4. **Accessibility**: Always consider wheelchair users and companion seats
5. **Contact Information**: Ensure customers can reach you for support

### Pricing Strategies

- **Peak/Off-Peak**: Adjust prices for popular vs. less popular dates
- **Early Bird**: Offer discounts for advance bookings
- **Group Discounts**: Encourage larger bookings
- **Season Passes**: Build audience loyalty
- **Dynamic Pricing**: Adjust based on demand

### Technical Considerations

- **Load Testing**: Test with expected peak booking times
- **Mobile Optimization**: Most bookings happen on phones
- **Payment Security**: Ensure PCI compliance through Stripe
- **Email Deliverability**: Test confirmation emails across providers
- **Backup Plans**: Have manual booking procedures ready

### Customer Experience

- **Clear Navigation**: Make the booking process intuitive
- **Seat Selection**: Visual seat maps help customers choose
- **Confirmation Process**: Clear confirmation and reminder emails
- **Support Channel**: Provide easy ways to get help
- **Accessibility Information**: Clear details about access provisions
