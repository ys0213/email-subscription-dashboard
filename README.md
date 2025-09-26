# Email Subscription Dashboard

A modern, full-stack email subscription management system built with Next.js, MongoDB, and TailwindCSS. This project includes both a public subscription form and an admin dashboard for managing subscribers.

## 🚀 Features

### Public Subscription Page
- **Email Subscription Form**: Clean, responsive form with validation
- **Real-time Validation**: Client-side email validation with error messages
- **Success/Error Handling**: User-friendly feedback for subscription status
- **EmailJS Integration**: Optional confirmation emails to subscribers

### Admin Dashboard
- **Subscriber Management**: View all subscribers with pagination
- **Privacy Protection**: Email addresses are masked for privacy (e.g., yus***@gmail.com)
- **Search & Filter**: Real-time search through subscriber list
- **Statistics Cards**: Total subscribers and recent signups metrics
- **Responsive Design**: Works perfectly on all devices

### Backend & Database
- **MongoDB Integration**: Secure connection to MongoDB Atlas
- **API Routes**: RESTful endpoints for subscription and data retrieval
- **Data Validation**: Server-side email validation and duplicate prevention
- **Error Handling**: Comprehensive error handling and logging

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS with dark mode support
- **Database**: MongoDB Atlas with Mongoose ODM
- **Email Service**: EmailJS (optional)
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone the repository**:
```bash
git clone <your-repo-url>
cd email-subscription-dashboard
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp env.example .env.local
```

4. **Configure your environment variables**:
```env
# Required: MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/email-subscriptions

# Optional: EmailJS configuration for confirmation emails
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
```

5. **Start the development server**:
```bash
npm run dev
```

6. **Open your browser**:
Navigate to `http://localhost:3000`

## 🗄️ Database Setup

### MongoDB Atlas Setup
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string and add it to `.env.local`

### Database Schema
The application uses a simple `Subscriber` model:
```typescript
{
  email: string (unique, required)
  subscribedAt: Date (default: now)
  isActive: boolean (default: true)
  source: string (default: 'website')
}
```

## 📡 API Endpoints

### POST `/api/subscribe`
Subscribe a new email address
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Successfully subscribed!",
  "subscriber": {
    "id": "...",
    "email": "user@example.com",
    "subscribedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET `/api/subscribers`
Fetch subscribers with pagination and search
**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for email filtering
- `sort`: Sort field (default: 'subscribedAt')
- `order`: Sort order 'asc' or 'desc' (default: 'desc')

**Response:**
```json
{
  "subscribers": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  },
  "stats": {
    "totalSubscribers": 100,
    "recentSignups": 5
  }
}
```

## 🎨 Pages & Components

### Pages
- **`/`** - Public subscription form
- **`/dashboard`** - Admin dashboard for managing subscribers

### Key Components
- **`EmailSubscriptionForm`** - Main subscription form with validation
- **`SubscriberTable`** - Data table with search, pagination, and email masking
- **`StatCard`** - Reusable metric display cards

## 🔒 Privacy & Security

- **Email Masking**: Subscriber emails are partially masked in the dashboard
- **Input Validation**: Both client and server-side validation
- **Duplicate Prevention**: Prevents duplicate email subscriptions
- **Environment Variables**: Sensitive data stored in environment variables
- **MongoDB Security**: Connection string and credentials secured

## 🚀 Deployment

### Deploy to Vercel
1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Vercel**:
- Connect your GitHub repository to Vercel
- Add environment variables in Vercel dashboard
- Deploy automatically

### Environment Variables for Production
```env
MONGODB_URI=your_production_mongodb_uri
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## 📊 Features in Detail

### Email Masking
For privacy protection, emails are displayed as:
- `john***@gmail.com` (for emails longer than 3 characters)
- `jo***@gmail.com` (for shorter emails)

### Search Functionality
- Real-time search with 300ms debounce
- Searches through email addresses
- Case-insensitive matching

### Statistics
- **Total Subscribers**: Count of all active subscribers
- **Recent Signups**: Subscribers who joined in the last 7 days
- **Active Rate**: Percentage of active vs inactive subscribers

## 🔧 Customization

### Adding New Fields
1. Update the `Subscriber` model in `models/Subscriber.ts`
2. Modify the API routes to handle new fields
3. Update the dashboard components to display new data

### Styling Changes
- Modify Tailwind classes in components
- Update `tailwind.config.js` for custom colors
- Add custom CSS in `styles/globals.css`

### Email Templates
- Configure EmailJS templates for confirmation emails
- Customize email content and styling
- Add unsubscribe functionality

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help setting up the project, please open an issue on GitHub.


