# MakTech Admin Dashboard

A production-ready React admin dashboard built with modern web technologies including React, Redux Toolkit, Tailwind CSS, and React Router.

## 🚀 Features

- ✅ **Modern Tech Stack**: React 18, Redux Toolkit, Tailwind CSS 3
- ✅ **Declarative Routing**: React Router v6 with nested routes
- ✅ **State Management**: Redux Toolkit with async thunks
- ✅ **API Integration**: Axios with interceptors and error handling
- ✅ **Responsive Design**: Mobile-first, fully responsive layouts
- ✅ **Clean Architecture**: Scalable folder structure
- ✅ **Production Comments**: Enterprise-level code documentation
- ✅ **Custom Tailwind Theme**: Easy-to-use utility classes

## 📁 Project Structure

```
maktech_website_frontend/
├── public/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── Sidebar.jsx
│   ├── features/            # Redux slices by feature
│   │   └── products/
│   │       ├── productsAPI.js      # API calls with Axios
│   │       └── productsSlice.js    # Redux slice with extraReducers
│   ├── layout/              # Layout components
│   │   └── AdminLayout.jsx
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── ComingSoon.jsx
│   ├── services/            # API configuration
│   │   └── apiClient.js
│   ├── utils/               # Utility functions
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   ├── store.js             # Redux store configuration
│   └── index.css            # Global styles + Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🎨 Custom Tailwind Colors

The project includes custom Tailwind utility classes for consistent branding:

- `bg-primary-bg` - Main background color (#1e293b)
- `text-primary-text` - Primary text color (#f8fafc)
- `hover:bg-primary-hover` - Hover state color (#334155)

### Usage Example:
```jsx
<div className="bg-primary-bg text-primary-text hover:bg-primary-hover">
  Custom styled element
</div>
```

## 🗺️ Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Login | Demo login page with credentials |
| `/admin` | AdminLayout | Main admin layout wrapper |
| `/admin/dashboard` | Dashboard | Main dashboard with stats |
| `/admin/emails` | ComingSoon | Email management (coming soon) |
| `/admin/leads` | ComingSoon | Lead management (coming soon) |
| `/admin/orders` | ComingSoon | Order management (coming soon) |
| `/admin/case-studies` | ComingSoon | Case studies (coming soon) |
| `/admin/blog` | ComingSoon | Blog management (coming soon) |
| `/admin/jobs` | ComingSoon | Job postings (coming soon) |
| `/admin/pricing` | ComingSoon | Pricing management (coming soon) |

## 🔐 Demo Credentials

Use these credentials on the login page:

- **Email**: admin@test.com
- **Password**: 123

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

The application will start on `http://localhost:3000`.

### Step 3: Build for Production
```bash
npm run build
```

### Step 4: Preview Production Build
```bash
npm run preview
```

## 📦 Key Dependencies

### Core
- **react** (^18.2.0) - UI library
- **react-dom** (^18.2.0) - DOM rendering
- **react-router-dom** (^6.22.1) - Routing
- **@reduxjs/toolkit** (^2.2.1) - State management
- **react-redux** (^9.1.0) - React-Redux bindings

### Utilities
- **axios** (^1.6.7) - HTTP client
- **lucide-react** (^0.577.0) - Icon library

### Styling
- **tailwindcss** (^4.0.0) - Utility-first CSS (v4 with CSS-first approach)

### Build Tools
- **vite** (^5.1.4) - Build tool and dev server
- **@vitejs/plugin-react** (^4.2.1) - React plugin for Vite

## 🏗️ Redux Architecture

### Store Configuration
The Redux store is configured in `src/store.js` using Redux Toolkit's `configureStore`.

### Feature-Based Slices
Slices are organized by feature in `src/features/`:
- Each feature has its own folder
- API calls are in `*API.js` files (using createAsyncThunk)
- State logic is in `*Slice.js` files (using createSlice with extraReducers)

### Example: Products Feature
```javascript
// API call with createAsyncThunk
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    const response = await axios.get('/products')
    return response.data
  }
)

// Slice with extraReducers
const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], loading: false, error: null },
  reducers: { /* synchronous actions */ },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload
        state.loading = false
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
  }
})
```

## 🧩 Components

### Layout Components
- **AdminLayout**: Main wrapper with sidebar and content area
- **Sidebar**: Fixed navigation with active link highlighting

### Page Components
- **Login**: Demo login with visible credentials
- **Dashboard**: Main dashboard with stats cards and product overview
- **ComingSoon**: Reusable placeholder for unimplemented pages

## 🎯 Next Steps

1. **Implement Authentication**: Add real authentication logic
2. **Build Feature Pages**: Complete the "Coming Soon" pages
3. **Add Form Validation**: Implement form validation library (e.g., React Hook Form)
4. **API Integration**: Connect to your backend API
5. **Testing**: Add unit and integration tests
6. **Dark Mode**: Implement theme switching
7. **Internationalization**: Add multi-language support

## 📝 Code Quality

All code includes production-level comments explaining:
- File purpose and architecture
- Function parameters and return values
- Component props and usage examples
- Business logic and data flow
- Integration points and dependencies

## 🤝 Contributing

1. Follow the existing folder structure
2. Maintain consistent code comments
3. Use the custom Tailwind colors for consistency
4. Keep components small and focused
5. Write reusable utility functions

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ by MakTech Development Team

## 🆘 Support

For questions or issues, please refer to the inline code comments or contact the development team.

---

**Happy Coding! 🚀**
