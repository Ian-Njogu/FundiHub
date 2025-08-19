# FundiHub - Job Board for Casual Workers

A React-based job board platform connecting skilled workers (fundis, cleaners, plumbers, day laborers) with clients in need of quality services.

## 🚀 Features

- **Worker Discovery**: Browse and filter workers by category and location
- **Worker Profiles**: Detailed profiles with skills, portfolio, and reviews
- **Job Posting**: Create and manage job requests
- **User Dashboard**: Track job status and manage bookings
- **Responsive Design**: Mobile-first, accessible interface
- **Mock API**: Complete mock backend for development

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS (with @tailwindcss/vite plugin)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Mock API**: MSW (Mock Service Worker)
- **Testing**: Jest + React Testing Library

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jobboard-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   └── Footer.jsx      # Site footer
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Workers.jsx     # Worker listing
│   ├── WorkerDetail.jsx # Individual worker profile
│   ├── Login.jsx       # Authentication
│   ├── Dashboard.jsx   # User dashboard
│   └── CreateJob.jsx   # Job creation form
├── mocks/              # Mock API setup
│   ├── handlers.js     # API endpoint handlers
│   └── browser.js      # MSW browser setup
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── styles/             # Additional styles
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## 🔌 Mock API Endpoints

The app includes a complete mock API with the following endpoints:

- `GET /api/v1/categories` - List all service categories
- `GET /api/v1/workers` - List workers (with filtering & pagination)
- `GET /api/v1/workers/:id` - Get worker details
- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/jobs` - Create new job
- `GET /api/v1/jobs?client_id=` - Get client's jobs
- `PATCH /api/v1/jobs/:id` - Update job status

## 🎨 UI Components

### Worker Cards
- Display worker information with availability status
- Show ratings, hourly rates, and skills
- Responsive grid layout

### Job Creation Form
- Form validation with React Hook Form
- Category selection and budget input
- Date/time scheduling

### Dashboard
- Job statistics and quick actions
- Recent jobs with status tracking
- User-friendly navigation

## 🔐 Authentication

- Simple JWT-style authentication stored in localStorage
- Mock login accepts any valid email/password
- Protected routes for authenticated users

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interface
- Accessible navigation

## 🧪 Testing

The project includes testing setup with:
- Jest for test runner
- React Testing Library for component testing
- MSW for API mocking in tests

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy to your preferred platform**
   - Vercel, Netlify, or any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository.

---

**Note**: This is a frontend-only implementation with mock data. In a production environment, you would connect to a real backend API.
