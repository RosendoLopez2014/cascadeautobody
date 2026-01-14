# Cascade Autobody & Paint Supply
## Development Plan - 1 Week Sprint

---

## Project Summary

| Item | Details |
|------|---------|
| **Client** | Cascade Autobody & Paint Supply |
| **Location 1** | 916 North 28th Ave, Suite A, Yakima, WA 98902 |
| **Location 2** | 216 S Beech St, Toppenish, WA 98948 |
| **Staging Domain** | rcktbuilds.com |
| **Production Domain** | cascadeautobodyandpaint.com |
| **Architecture** | Next.js 14 + WooCommerce (Headless) + MicroBiz POS |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Cloudways (WooCommerce) |
| **Payments** | Stripe |
| **AI Chatbot** | Lightweight model (GPT-3.5-turbo or Claude Haiku) |

---

## Tech Stack

```
FRONTEND                          BACKEND                    INTEGRATIONS
─────────────────────────────────────────────────────────────────────────
Next.js 14 (App Router)           WooCommerce                MicroBiz POS
React 18 + TypeScript             WordPress/Cloudways        Stripe
Tailwind CSS                      REST API                   AI Chat (Haiku/GPT-3.5)
Zustand (cart state)              MicroBiz Sync              Vercel
React Query (data fetching)
```

---

## 1-Week Sprint Schedule

### Day 1: Foundation + E-Commerce Core
**Goal**: Project setup, product listing, product detail pages

#### Morning
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Configure Tailwind CSS with clean, modern theme
- [ ] Set up project structure
- [ ] Create WooCommerce API client (typed)
- [ ] Deploy to Vercel (staging)

#### Afternoon
- [ ] Build core layout (Header, Footer, Navigation)
- [ ] Product listing page with grid
- [ ] Category filtering
- [ ] Search functionality
- [ ] Product card component with multi-location inventory:
  ```
  📍 Yakima: 12 | Toppenish: 5
  ```

#### Evening
- [ ] Product detail page
- [ ] Image gallery
- [ ] Add to cart functionality
- [ ] Mobile responsive testing

---

### Day 2: Shopping Cart + Checkout
**Goal**: Complete purchase flow with all fulfillment options

#### Morning
- [ ] Shopping cart (drawer + page)
- [ ] Cart state management (Zustand)
- [ ] Quantity adjustments
- [ ] Cart persistence (localStorage)
- [ ] Real-time inventory validation

#### Afternoon
- [ ] Checkout page layout
- [ ] Fulfillment method selection:
  - Local Pickup (location selector)
  - Local Delivery (Yakima/Toppenish area)
  - Shipping (address form)
- [ ] Shipping/delivery zone logic

#### Evening
- [ ] Stripe integration
- [ ] Order submission to WooCommerce
- [ ] Order confirmation page
- [ ] Confirmation email trigger
- [ ] Inventory conflict handling (atomic check)

---

### Day 3: Customer Accounts
**Goal**: Login, registration, order history, business account application

#### Morning
- [ ] Authentication system (WooCommerce JWT or NextAuth)
- [ ] Login page
- [ ] Registration page
- [ ] Password reset flow
- [ ] Session management

#### Afternoon
- [ ] Customer dashboard
- [ ] Order history
- [ ] Order detail view
- [ ] Account settings

#### Evening
- [ ] Business account application form
- [ ] Application submission (stored in WooCommerce)
- [ ] Admin notification email
- [ ] Account status display

---

### Day 4: Business Features + Paint Services
**Goal**: Wholesale pricing, business dashboard, paint/mixing bank page

#### Morning
- [ ] Role-based pricing (retail vs wholesale)
- [ ] Business account dashboard:
  - Credit limit display
  - Net terms display
  - Available credit calculation
- [ ] Purchase order support (basic)

#### Afternoon
- [ ] Paint services page
- [ ] Paint mixing information
- [ ] Color matching request form
- [ ] Exclusive products section

#### Evening
- [ ] Mixing Bank dashboard (business accounts):
  - Purchase history by product
  - Quick reorder interface
  - Add selected to cart
- [ ] Basic reorder suggestions

---

### Day 5: AI Chatbot + About Page
**Goal**: Functional AI assistant, company information page

#### Morning
- [ ] Set up AI provider (Claude Haiku or GPT-3.5-turbo)
- [ ] Build chat API route
- [ ] Create product knowledge base from WooCommerce
- [ ] System prompt for autobody/paint expertise

#### Afternoon
- [ ] Chat UI component (floating widget)
- [ ] Conversation handling
- [ ] Product search/recommendation capability
- [ ] Store hours/location responses

#### Evening
- [ ] About Us page
- [ ] Company information
- [ ] Location cards with maps
- [ ] Store hours
- [ ] Contact information

---

### Day 6: Integration Testing + Polish
**Goal**: End-to-end testing, bug fixes, performance optimization

#### Morning
- [ ] Full purchase flow testing (all 3 fulfillment types)
- [ ] Business account flow testing
- [ ] MicroBiz sync verification
- [ ] Payment processing test (Stripe test mode)
- [ ] Multi-location inventory accuracy

#### Afternoon
- [ ] Mobile responsiveness audit
- [ ] Cross-browser testing
- [ ] Bug fixes from testing
- [ ] Loading states and error handling
- [ ] Form validation improvements

#### Evening
- [ ] Performance optimization
- [ ] Image optimization
- [ ] Lighthouse audit (target 85+)
- [ ] SEO basics (meta tags, structured data)
- [ ] Sitemap generation

---

### Day 7: Launch Preparation + Go Live
**Goal**: Final checks, domain setup, launch

#### Morning
- [ ] Final bug fixes
- [ ] Content review (placeholder text replaced)
- [ ] Domain DNS configuration (cascadeautobodyandpaint.com)
- [ ] SSL verification
- [ ] Environment variables for production

#### Afternoon
- [ ] Production deployment to Vercel
- [ ] Stripe live mode activation
- [ ] Final smoke tests on production
- [ ] Analytics setup (Google Analytics 4)
- [ ] Error monitoring (Sentry - optional)

#### Evening
- [ ] Go live announcement
- [ ] Monitor for issues
- [ ] Document any immediate post-launch fixes needed
- [ ] Handoff documentation

---

## MVP vs Post-Launch Features

### Included in 1-Week MVP ✓
- [x] Product catalog with multi-location inventory
- [x] Shopping cart + checkout
- [x] 3 fulfillment options (pickup, delivery, shipping)
- [x] Customer accounts + order history
- [x] Business account application
- [x] Wholesale pricing display
- [x] Basic credit limit/terms display
- [x] Paint services page
- [x] Mixing bank quick reorder
- [x] AI chatbot (basic)
- [x] About page
- [x] Mobile responsive

### Deferred to Post-Launch
- [ ] Invoice generation + PDF download
- [ ] Advanced usage analytics for mixing bank
- [ ] Low stock email alerts
- [ ] Team member management for business accounts
- [ ] Advanced AI training with technical data sheets
- [ ] Customer sync push to MicroBiz (verify existing sync first)
- [ ] Order tracking integration (carrier APIs)
- [ ] Branding assets integration (when ready)

---

## File Structure

```
cascade-autobody/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage
│   │   ├── layout.tsx                  # Root layout
│   │   ├── shop/
│   │   │   ├── page.tsx                # Product listing
│   │   │   ├── [category]/page.tsx     # Category page
│   │   │   └── product/[slug]/page.tsx # Product detail
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── account/
│   │   │   ├── page.tsx                # Dashboard
│   │   │   ├── orders/page.tsx
│   │   │   ├── orders/[id]/page.tsx
│   │   │   ├── business/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── paint/
│   │   │   ├── page.tsx                # Paint services
│   │   │   └── mixing-bank/page.tsx    # Business reorder
│   │   ├── about/page.tsx
│   │   └── api/
│   │       ├── products/route.ts
│   │       ├── cart/route.ts
│   │       ├── checkout/route.ts
│   │       ├── auth/[...nextauth]/route.ts
│   │       └── chat/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── InventoryBadge.tsx
│   │   │   ├── AddToCart.tsx
│   │   │   └── CategoryFilter.tsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── checkout/
│   │   │   ├── FulfillmentSelector.tsx
│   │   │   ├── AddressForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── OrderSummary.tsx
│   │   ├── account/
│   │   │   ├── OrderHistory.tsx
│   │   │   ├── BusinessDashboard.tsx
│   │   │   └── MixingBank.tsx
│   │   ├── chat/
│   │   │   ├── ChatWidget.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── ChatInput.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── Badge.tsx
│   │       └── Spinner.tsx
│   ├── lib/
│   │   ├── woocommerce.ts          # WooCommerce API client
│   │   ├── stripe.ts               # Stripe helpers
│   │   ├── ai.ts                   # AI chat client
│   │   └── utils.ts                # Utility functions
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useAuth.ts
│   │   ├── useProducts.ts
│   │   └── useChat.ts
│   ├── stores/
│   │   └── cartStore.ts            # Zustand cart store
│   └── types/
│       ├── product.ts
│       ├── cart.ts
│       ├── order.ts
│       └── user.ts
├── public/
│   ├── images/
│   └── fonts/
├── .env.local                      # Local environment variables
├── .env.example                    # Example env file
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Environment Variables

```env
# WooCommerce
WOOCOMMERCE_URL=https://rcktbuilds.com
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxxxx
STRIPE_SECRET_KEY=sk_xxxxx

# AI Chat
ANTHROPIC_API_KEY=sk-ant-xxxxx  # or OPENAI_API_KEY

# App
NEXT_PUBLIC_SITE_URL=https://cascadeautobodyandpaint.com
```

---

## Data Flows

### Inventory Display
```
MicroBiz → WooCommerce (real-time sync) → Next.js API → Product Page
                                                            │
                                           ┌────────────────┴────────────────┐
                                           │   📍 Yakima: 12 in stock        │
                                           │   📍 Toppenish: 5 in stock      │
                                           └─────────────────────────────────┘
```

### Order Flow
```
Add to Cart → Checkout → Select Fulfillment → Stripe Payment
                                                    │
                                                    ▼
                              ┌─────────────────────────────────────┐
                              │ Atomic inventory check              │
                              │ Reserve stock                       │
                              │ Create WooCommerce order            │
                              │ Sync to MicroBiz                    │
                              │ Send confirmation email             │
                              └─────────────────────────────────────┘
```

### Business Account Flow
```
Apply → Admin Reviews → Approved → Pricing Tier Assigned → Wholesale Access
                                         │
                                         ▼
                        ┌────────────────────────────────┐
                        │ Credit Limit: $5,000           │
                        │ Terms: Net 30                  │
                        │ Tier: Wholesale                │
                        └────────────────────────────────┘
```

---

## Sync Verification Checklist

Before development, verify with WooCommerce MCP:

- [ ] Products sync correctly from MicroBiz
- [ ] Inventory levels update in real-time
- [ ] Multi-location stock is mapped (Yakima ID, Toppenish ID)
- [ ] Orders push back to MicroBiz
- [ ] Customer accounts sync to MicroBiz
- [ ] Price tiers are respected

---

## Design System (Placeholder)

Until branding is ready, use:

```css
/* Colors - Clean & Professional */
--primary: #1e40af;        /* Blue - trust, reliability */
--primary-dark: #1e3a8a;
--secondary: #f97316;      /* Orange - energy, action */
--neutral-50: #fafafa;
--neutral-100: #f5f5f5;
--neutral-900: #171717;

/* Typography */
--font-sans: 'Inter', system-ui, sans-serif;
--font-heading: 'Inter', system-ui, sans-serif;

/* Spacing - 4px base */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-4: 1rem;
--space-8: 2rem;

/* Border Radius */
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
--radius-lg: 1rem;
```

---

## Success Criteria

### Day 7 Go-Live Checklist
- [ ] Customer can browse products
- [ ] Customer can see inventory at both locations
- [ ] Customer can add to cart and checkout
- [ ] All 3 fulfillment methods work
- [ ] Stripe payments process successfully
- [ ] Order appears in WooCommerce
- [ ] Order syncs to MicroBiz
- [ ] Customer can create account
- [ ] Customer can view order history
- [ ] Business can apply for account
- [ ] Paint services page is informative
- [ ] AI chatbot answers basic questions
- [ ] Site is mobile responsive
- [ ] Site loads in under 3 seconds
- [ ] No critical errors in console

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| MicroBiz sync issues | Verify sync before building; have fallback to WooCommerce-only |
| Stripe integration delays | Use Stripe's prebuilt checkout as backup |
| AI chatbot complexity | Start with FAQ-style responses; enhance post-launch |
| Time overrun | Prioritize checkout flow; defer business features if needed |
| Multi-location complexity | Simplify to "check both locations" message if mapping fails |

---

## Post-Launch Roadmap

### Week 2
- [ ] Branding integration (when assets ready)
- [ ] Enhanced AI chatbot with product data
- [ ] Invoice PDF generation
- [ ] Order tracking integration

### Week 3-4
- [ ] Email marketing integration
- [ ] Customer reviews/ratings
- [ ] Advanced analytics dashboard
- [ ] Performance monitoring

### Month 2+
- [ ] Mobile app consideration
- [ ] Loyalty program
- [ ] Advanced inventory alerts
- [ ] B2B portal enhancements

---

## Contact & Support

**Development**: [Your contact]
**Hosting (Cloudways)**: support@cloudways.com
**Hosting (Vercel)**: vercel.com/support
**Payments (Stripe)**: dashboard.stripe.com

---

*Generated: January 2026*
*Last Updated: January 13, 2026*
