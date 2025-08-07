# PicknDeal React Frontend

This is the React frontend application for PicknDeal, converted from the Laravel Blade views to a modern React + Vite application.

## Features

- User authentication (Login/Signup)
- Dashboard with statistics and quick actions
- Requirements management
- Product catalog
- Quotes system
- User profiles
- Responsive design with Tailwind CSS

## Tech Stack

- React 18
- Vite
- React Router v6
- Tailwind CSS
- Axios for API calls
- React Query for data fetching
- React Toastify for notifications

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Laravel backend running on http://localhost:8000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your API URL if different from default:
```
VITE_API_URL=http://localhost:8000/api
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable components
├── contexts/       # React contexts (Auth, etc.)
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API services
├── utils/          # Utility functions
└── App.jsx         # Main application component
```

## API Integration

The application connects to the Laravel backend API. Make sure the Laravel application is running and accessible at the URL specified in your `.env` file.

### Authentication

The app uses token-based authentication. The auth token is stored in localStorage and automatically included in API requests.

## Available Routes

- `/login` - User login
- `/signup` - User registration
- `/dashboard` - Main dashboard
- `/profile` - User profile
- `/requirements` - Requirements list
- `/requirements/add` - Add new requirement
- `/catalog` - Product catalog
- `/quotes` - Quotes management

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is proprietary and confidential.
