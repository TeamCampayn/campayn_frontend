# Razorpay Verification - Legal Pages Setup

## Overview
This document outlines the legal pages created for Razorpay payment gateway verification. Razorpay requires certain mandatory pages to be available on your website/app before enabling payments.

## Pages Created

### 1. Terms and Conditions (`/terms`)
**File:** `src/pages/legal/TermsAndConditions.tsx`

**URL:** `https://yourdomain.com/terms`

**Content Includes:**
- Introduction and definitions
- Account registration requirements
- Services for brands and creators
- Payment terms (brand and creator)
- Content guidelines
- Intellectual property rights
- Prohibited activities
- Dispute resolution
- Limitation of liability
- Service modifications
- Termination policy
- Data protection
- Contact information
- Governing law (India)

**Key Points:**
- Minimum age requirement: 18 years
- Payment processing through Razorpay
- Campaign fees non-refundable once creators are assigned
- Creator payment timeline: 5-7 business days after approval
- All content must comply with Instagram's terms and clearly disclose sponsorships

---

### 2. Privacy Policy (`/privacy`)
**File:** `src/pages/legal/PrivacyPolicy.tsx`

**URL:** `https://yourdomain.com/privacy`

**Content Includes:**
- Information collection practices
- How data is used
- Information sharing and disclosure
- Data security measures
- User rights and choices
- Data retention policies
- Third-party links
- Children's privacy
- International data transfers
- Cookies and tracking
- Contact information

**Key Data Collected:**
- Personal information (name, email, password)
- Instagram data (profile, analytics, content)
- Usage information (campaign activities, searches)
- Technical information (IP, device, browser)
- Payment information (processed via Razorpay)

**Compliance:**
- Information Technology Act, 2000 (India)
- IT (Reasonable Security Practices) Rules, 2011
- GDPR principles
- Payment gateway requirements (Razorpay, RBI)

---

### 3. Shipping and Delivery Policy (`/shipping`)
**File:** `src/pages/legal/ShippingPolicy.tsx`

**URL:** `https://yourdomain.com/shipping`

**Content Includes:**
- Service nature (digital SaaS platform)
- Digital service delivery
- Product sampling (when applicable)
- Data and analytics delivery
- Payment delivery timelines
- Content delivery process
- Service availability
- Geographic coverage
- Delays and issues handling

**Key Points:**
- Campayn is a digital platform - no physical shipping
- Platform access granted immediately
- Product sampling managed by brands (not Campayn)
- Payment processing: 5-7 business days for creators
- Analytics and reports available in real-time

---

### 4. Contact Us (`/contact`)
**File:** `src/pages/legal/ContactUs.tsx`

**URL:** `https://yourdomain.com/contact`

**Contact Channels:**
- **General Inquiries:** info@campayn.com
- **Technical Support:** support@campayn.com (2-4 hours urgent response)
- **Sales & Partnerships:** sales@campayn.com, +91-XXX-XXX-XXXX
- **Office Address:** Bangalore, Karnataka, India

**Department-Specific:**
- creators@campayn.com - For influencers
- brands@campayn.com - For brands
- payments@campayn.com - Billing issues
- legal@campayn.com - Legal matters
- privacy@campayn.com - Data protection
- press@campayn.com - Media inquiries

**Business Hours:**
- Customer Support: Mon-Fri 9 AM - 8 PM IST, Sat 10 AM - 6 PM IST
- Sales: Mon-Fri 9 AM - 6 PM IST
- Emergency: 24/7 emergency line available

---

### 5. Cancellation and Refunds (`/refunds`)
**File:** `src/pages/legal/CancellationRefunds.tsx`

**URL:** `https://yourdomain.com/refunds`

**Refund Policy:**

**Before Creator Assignment:**
- ✅ 100% refund
- Processing: 5-7 business days

**After Creator Assignment (Before Content):**
- ⚠️ 70% refund (30% platform fee)
- Processing: 7-10 business days

**After Content Submission:**
- ❌ No refund
- Work completed as agreed

**After Content Publication:**
- ❌ No refund or cancellation
- Campaign objectives met

**Refund Timeline:**
- Request review: 1-2 business days
- Processing: 5-7 business days
- Bank credit: Additional 2-3 days

**Non-Refundable:**
- Platform fees
- Payment gateway charges
- Completed services
- Premium features (once used)

---

## Implementation Details

### Routes Added to App.tsx
```typescript
// Legal Pages - Public Access
<Route path="/terms" element={<TermsAndConditions />} />
<Route path="/privacy" element={<PrivacyPolicy />} />
<Route path="/shipping" element={<ShippingPolicy />} />
<Route path="/contact" element={<ContactUs />} />
<Route path="/refunds" element={<CancellationRefunds />} />
```

### Footer Updated
The landing page footer (`src/components/landing/Footer.tsx`) has been updated to include links to all legal pages:

**Legal Section:**
- Terms & Conditions
- Privacy Policy
- Shipping Policy
- Refund Policy

**Bottom Bar Links:**
- Privacy Policy
- Terms of Service
- Refund Policy

---

## Razorpay Verification Checklist

When submitting to Razorpay, provide these URLs:

- ✅ **Terms and Conditions:** `https://yourdomain.com/terms`
- ✅ **Privacy Policy:** `https://yourdomain.com/privacy`
- ✅ **Shipping Policy:** `https://yourdomain.com/shipping`
- ✅ **Contact Us:** `https://yourdomain.com/contact`
- ✅ **Cancellation and Refunds:** `https://yourdomain.com/refunds`

---

## Important Notes for Razorpay Submission

### 1. Update Placeholder Information
Before going live, replace the following placeholders in the legal pages:

**Contact Information:**
- Phone numbers: Currently `+91-XXX-XXX-XXXX`
- Office address details: Building name, street, PIN code
- Email addresses: Verify all email addresses are active

**Company Details:**
- Company registration number
- GST number (if applicable)
- Complete registered office address

### 2. Business Information
Ensure you have:
- Valid business registration documents
- GST registration (if turnover exceeds threshold)
- PAN card of business
- Bank account details for settlements

### 3. Website Requirements
- Ensure website is live and accessible
- All pages load properly without errors
- Footer with legal links visible on all pages
- Professional design and complete information

### 4. Legal Compliance
- Review terms with a lawyer (recommended)
- Ensure compliance with Indian laws
- Update policies as business evolves
- Keep records of policy versions

---

## Testing the Pages

### Local Testing
```bash
cd zestful-campaign-craft-69
npm run dev
```

Visit:
- http://localhost:8080/terms
- http://localhost:8080/privacy
- http://localhost:8080/shipping
- http://localhost:8080/contact
- http://localhost:8080/refunds

### Production Deployment
After deploying to production:
1. Verify all pages load correctly
2. Check mobile responsiveness
3. Test all footer links
4. Ensure proper navigation (back buttons work)
5. Submit URLs to Razorpay for verification

---

## Next Steps for Razorpay Integration

### 1. Create Razorpay Account
- Go to https://razorpay.com
- Sign up for business account
- Complete KYC verification

### 2. Get API Keys
- Navigate to Dashboard → API Keys
- Generate Test API keys for development
- Generate Live API keys for production (after verification)

### 3. Update Backend Configuration
Add to `backend/.env`:
```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 4. Install Razorpay SDK
```bash
cd backend
npm install razorpay
```

### 5. Implement Payment Flow
- Create payment order endpoint
- Integrate Razorpay checkout on frontend
- Handle payment success/failure webhooks
- Store payment records in database

### 6. Submit for Verification
- Submit website with all legal pages
- Wait for Razorpay approval (typically 1-2 business days)
- Once approved, switch from test to live keys

---

## Support

For any questions or issues:
- **Technical Support:** support@campayn.com
- **Legal Questions:** legal@campayn.com
- **Razorpay Issues:** Contact Razorpay support at support@razorpay.com

---

## License & Copyright

© 2024 Campayn India Pvt Ltd. All rights reserved.

All legal pages are customized for Campayn's business model. Please review and modify according to your specific business requirements and legal counsel.
