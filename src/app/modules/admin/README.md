# Geminia Insurance - Admin Dashboard

## Overview
A comprehensive admin dashboard for managing users, monitoring transactions, tracking shipments, and viewing analytics for Geminia Insurance platform.

---

## 🎯 Features

### **Dashboard**
- 6 key performance metrics with trend indicators
- Website traffic visualization
- Sales analytics charts
- Product distribution breakdown
- Quick stats (conversion rate, success rate, etc.)
- Recent transactions table

### **User Management**
- View all registered users
- Search users by name, email, or phone
- Create new users
- Edit user details
- Delete users
- View user roles and status
- Track user creation dates

### **Quote Users**
- View all users who created quotes
- See quote details (type, reference, sum insured)
- View user credentials
- Track quote status (Draft/Submitted/Paid)
- Monitor quote values

### **Premium Buyers**
- View all users who purchased premiums
- Filter by product type (Marine/Travel)
- See policy information
- Track policy status (Active/Expired)
- View premium amounts and sum insured
- Download policy certificates

### **Transactions**
- View all payment transactions
- Filter by status (Completed/Pending/Failed)
- See transaction details (ref no, user, product, amount)
- Track payment methods
- View transaction timestamps
- Export transaction data

### **Shipments**
- **High Risk Shipments**: Monitor and approve/reject high-risk cargo
- **Export Cover Requests**: Manage export shipment cover requests
- Risk level indicators (Critical/High/Medium/Low)
- Status management (Pending/Approved/Under Review/Rejected)

---

## 🎨 Design

### **Colors (Geminia Brand)**
- Primary: `#21275c` - Deep blue
- Secondary: `#04b2e1` - Bright cyan
- Accent: `#f36f21` - Orange

### **Layout**
- Fixed dark sidebar with navigation
- Flexible content area
- Responsive grid layouts
- Card-based design
- Smooth transitions

---

## 🚀 Getting Started

### **Access the Dashboard**
```
http://localhost:4200/admin/dashboard
```

### **Navigation**
Use the sidebar to navigate between different sections:
- Dashboard (Overview)
- User Management
- Quote Users
- Premium Buyers
- Transactions
- High Risk Shipments

---

## 📡 API Integration

### **Service**: `AdminService`
Location: `src/app/modules/admin/services/admin.service.ts`

### **Methods Available**
- `getDashboardMetrics()` - Dashboard metrics
- `getWebsiteTraffic()` - Traffic data
- `getAllUsers()` - User list
- `createUser()` - Create new user
- `getQuoteUsers()` - Quote creators
- `getPremiumBuyers()` - Premium purchasers
- `getAllTransactions()` - Transaction list
- `getHighRiskShipments()` - High risk shipments
- `getExportCoverRequests()` - Export requests

### **Mock Data**
All components include mock data fallback for testing without backend.

---

## 🔧 Development

### **Adding New Features**

1. Create new component in `pages/`
2. Add route in `admin.routes.ts`
3. Add sidebar link in `sidebar.component.html`
4. Add API method in `admin.service.ts`

### **Customizing Metrics**

Edit `dashboard.component.ts` and add new metrics to the `metrics` object.

### **Styling**

All components use Tailwind CSS with Geminia brand colors.

---

## ✅ Status

**Implementation**: ✅ Complete  
**Routing**: ✅ Configured  
**Components**: ✅ All created  
**Styling**: ✅ Geminia colors applied  
**Mock Data**: ✅ Available for testing  
**Backend**: ⚠️ Requires API implementation

---

## 📝 Notes

- All components are standalone
- Uses Angular reactive patterns
- Includes error handling
- Loading states implemented
- Responsive design
- Accessible navigation

---

**Ready to use!** Navigate to `/admin/dashboard` to explore the admin panel.
