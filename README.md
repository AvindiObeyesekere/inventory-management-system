# Inventory Management System

A modern, responsive inventory management application built with React, TypeScript, and Tailwind CSS. Features separate desktop and mobile interfaces for optimal user experience across all devices.
Netlify Hosted App -
https://6a521bbbe369be0008c8f5bc--inventory-management-scaler.netlify.app/
## 🚀 Features

### Core Functionality
- **Product Management**: Create, read, update, and delete products with detailed information
- **Category Management**: Organize products into categories with custom images. 
- **Stock Management**: Increase or decrease stock quantities with validation
- **Stock History**: Complete audit trail of all stock changes
- **CSV Export**: Export product data to CSV format for external analysis
- **Search & Filter**: Real-time search by product name or SKU, filter by category
- **Sorting**: Sort products alphabetically (A-Z / Z-A)

### Desktop Features
- **Sidebar Navigation**: Easy access to all sections
- **Analytics Dashboard**: Visual charts showing category distribution and stock levels
- **Data Tables**: Comprehensive product listings with pagination
- **Quick Actions**: Fast access to common tasks
- **KPI Cards**: Real-time stats (total products, inventory value, categories)

### Mobile Features
- **Bottom Navigation**: Touch-friendly navigation bar
- **Card-Based Layout**: Optimized for small screens
- **Floating Action Button**: Quick access to add products
- **Responsive Design**: Automatically adapts to screen size
- **Touch-Optimized**: Large buttons and inputs for mobile interaction

### Technical Features
- **Responsive Architecture**: Separate mobile and desktop UIs with shared business logic
- **Form Validation**: Comprehensive validation using Formik + Yup
- **Data Persistence**: localStorage for offline data storage
- **Type Safety**: Full TypeScript implementation
- **Dark Mode Support**: Built with Tailwind CSS dark mode
- **Real-Time Updates**: Instant UI updates without page refresh

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Forms**: Formik + Yup validation
- **Charts**: Recharts for analytics
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Storage**: Browser localStorage

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/inventory-management-system.git
   cd inventory-management-system/inventory-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:5174
   ```

## 🏗️ Project Structure

```
inventory-management/
├── src/
│   ├── mobile/                    # Mobile-specific components
│   │   ├── components/
│   │   │   └── BottomNav.tsx     # Mobile bottom navigation
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx     # Mobile dashboard
│   │   │   ├── Products.tsx      # Mobile products page
│   │   │   ├── Stock.tsx         # Mobile stock management
│   │   │   └── Categories.tsx    # Mobile categories page
│   │   └── MobileLayout.tsx      # Mobile layout wrapper
│   │
│   ├── pages/                     # Desktop pages
│   │   ├── Dashboard.tsx
│   │   ├── Products.tsx
│   │   ├── Stock.tsx
│   │   └── Categories.tsx
│   │
│   ├── components/               # Reusable components
│   │   ├── modals/
│   │   │   ├── ProductFormModal.tsx
│   │   │   └── ConfirmModal.tsx
│   │   ├── Pagination.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── layouts/
│   │   └── DashboardLayout.tsx   # Desktop layout with sidebar
│   │
│   ├── hooks/
│   │   ├── useIsMobile.ts        # Mobile detection hook
│   │   └── usePagination.ts      # Pagination logic
│   │
│   ├── utils/
│   │   └── localStorage.ts        # Data persistence utilities
│   │
│   ├── App.tsx                    # Main app with responsive routing
│   └── main.tsx                   # Entry point
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎯 How to Use

### Desktop View
1. Navigate to `/dashboard` to see analytics
2. Go to `/products` to manage products
3. Use `/stock/restock` or `/stock/deduct` for stock management
4. Visit `/categories` to organize products

### Mobile View
1. Resize browser to < 768px width OR
2. Open DevTools and toggle device emulation
3. Bottom navigation appears automatically
4. All features available with mobile-optimized UI

### Adding a Product
1. Click "Add Product" button
2. Fill in product details:
   - Product Name (required)
   - Category (required)
   - Price (required)
   - Stock Quantity (required)
   - Metric Value (optional, e.g., "1L", "500g")
3. Click "Add Product"

### Managing Stock
1. Go to Stock Management page
2. Select "Increase" or "Decrease"
3. Choose a product
4. Enter quantity
5. Click "Increase Stock" or "Decrease Stock"
6. View history log below

### Adding Categories with Images
1. Go to Categories page
2. Click "+" button
3. Enter category name
4. (Optional) Paste image URL
5. Click "Add"

### Exporting Data
1. Go to Products page
2. Click the download icon (top right)
3. CSV file downloads automatically

## 🧪 Testing

### Manual Testing Checklist
- [ ] Add a new product
- [ ] Edit an existing product
- [ ] Delete a product
- [ ] Search for products
- [ ] Filter by category
- [ ] Sort products A-Z / Z-A
- [ ] Increase stock
- [ ] Decrease stock (with validation)
- [ ] Add category with image
- [ ] View category products
- [ ] Export CSV
- [ ] Test on mobile viewport (< 768px)
- [ ] Test on desktop viewport (> 768px)
- [ ] Verify data persists after refresh

## 🚢 Deployment on Netlify

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect GitHub repository to Netlify, main branch deployed not feature branch
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

## 📝 Development Notes

### Responsive Design Approach
- **Desktop**: Full sidebar navigation, data tables, analytics charts
- **Mobile**: Bottom navigation, card-based layouts, simplified UI
- **Shared**: Business logic and data management
- **Detection**: `useIsMobile` hook checks viewport width (768px breakpoint)

### Data Storage
- All data stored in browser localStorage
- No backend required
- Data persists across sessions
- Clear browser data to reset

### Form Validation
- Required fields enforced
- Numeric validation for prices and quantities
- URL validation for category images
- Stock deduction validation (can't deduct more than available)

## 🐛 Known Limitations

1. **localStorage Quota**: ~5-10MB limit (sufficient for thousands of products)
2. **No User Authentication**: Single-user application
3. **No Backend**: Data stored locally in browser
4. **CSV Escaping**: Commas in product names may break CSV format
5. **No Image Upload**: Only image URLs supported

## 🔮 Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Backend API integration
- [ ] Image upload functionality
- [ ] Barcode/QR code scanning
- [ ] Advanced analytics and reporting
- [ ] In App notifications and SMTP
- [ ] Product categories management in mobile
- [ ] Batch operations (bulk import/export)
- [ ] Search history and saved filters
- [ ] Print/PDF export

## 👨‍💻 Author

Built with enthusiasm for internship application by Avindi Obeyesekere

## 📄 License

This project is created for assessment purposes.
##  Screenshots
<img width="1917" height="911" alt="image" src="https://github.com/user-attachments/assets/be0d4993-6ef7-44b3-824e-f5a1e6899eeb" />
<img width="1898" height="906" alt="image" src="https://github.com/user-attachments/assets/bdd6a5e4-69b1-448f-a505-7d99e8db0c83" />
<img width="1917" height="908" alt="image" src="https://github.com/user-attachments/assets/7bdf76ef-f443-4ca3-bb55-3e8a9448c486" />
<img width="1915" height="905" alt="image" src="https://github.com/user-attachments/assets/17b19dd4-673c-4c0f-b70c-98aca21d2cb0" />
<img width="1916" height="907" alt="image" src="https://github.com/user-attachments/assets/7e0edfc8-3c8e-44a4-9011-3c093d2e67bf" />
<img width="1918" height="907" alt="image" src="https://github.com/user-attachments/assets/437cf158-f712-4358-b599-fa5a22da6e27" />
<img width="1918" height="911" alt="image" src="https://github.com/user-attachments/assets/f14175d7-6757-4a51-a2f7-3eff907f6876" />
<img width="1916" height="906" alt="image" src="https://github.com/user-attachments/assets/39a0ed31-f0ac-4f8d-ba7b-02c05b7ab380" />
<img width="1896" height="906" alt="image" src="https://github.com/user-attachments/assets/1d91f9eb-65a7-4333-9af7-efe188379e63" />
<img width="1918" height="911" alt="image" src="https://github.com/user-attachments/assets/be687728-8343-488f-ba10-4421a16234a8" />
<img width="1917" height="906" alt="image" src="https://github.com/user-attachments/assets/151dea43-a406-4649-b522-0d800a9e4dee" />
<img width="1917" height="908" alt="image" src="https://github.com/user-attachments/assets/d6bb3617-58cb-4d6b-82b6-9192f5050b84" />


---

**Note**: This is a frontend-only application using localStorage for data persistence. For future production use, need to integrate with a backend API and database.
