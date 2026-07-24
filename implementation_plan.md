# Implementation Plan - SideQuest Skill Exchange Platform

SideQuest is a full-stack, production-ready skill exchange platform where users trade knowledge directly without money (e.g., teaching Python in exchange for learning Guitar). The platform features an intelligent weighted matching engine, real-time Socket.io chat, swap request lifecycle management, session tracking, multi-criteria reviews, gamified XP/badge system, an admin panel, and an analytics dashboard.

---

## Technical Stack & Architecture

### Backend Architecture
- **Runtime & Framework**: Node.js + Express.js (MVC Pattern)
- **Database**: MongoDB with Mongoose Schemas (User, Skill, SwapRequest, Chat/Message, Session, Review, Notification, Badge)
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing & cookie/header storage
- **Real-Time Engine**: Socket.io server with events for active typing, online status, chat messages, and instant notifications
- **File Uploads**: Cloudinary integration with local fallback simulation for zero-friction setup
- **Smart Matching Engine**: Weighted algorithmic scoring module (`Teach/Learn 40%`, `Skill Level 15%`, `Availability 15%`, `Location 10%`, `Language 10%`, `Rating 10%`) + Graph engine module for 3-way/multi-user exchange chain discovery (`A → B → C → A`)

### Frontend Architecture
- **Framework & Build**: React + Vite
- **Styling**: Tailwind CSS + Custom CSS Design System (Sleek Dark Mode default, Glassmorphism, Linear/Discord/Notion-inspired UI, smooth animations)
- **Icons & Visuals**: `lucide-react`, custom progress bars, badge icons, micro-interactions
- **State Management & HTTP**: React Context / Hooks + Axios with interceptors
- **Real-Time Client**: Socket.io-client client hooks

---

## User Review Required

> [!NOTE]
> **Zero-Friction Local Execution Setup**:
> The application will be fully configured to run with local environment defaults. If MongoDB or Cloudinary credentials are not immediately provided in `.env`, the server will gracefully fallback to an in-memory/mock data store or local MongoDB connection so you can test all features (real-time chat, smart matching, swap requests, gamification, admin dashboard) immediately without external setup friction.

> [!IMPORTANT]
> **Indirect Multi-User Skill Exchange Graph Engine**:
> We will include a dedicated graph cycle detection engine in `server/services/graphMatchingService.js` that scans user skill edges to detect indirect trading loops (e.g. User A teaches User B, User B teaches User C, User C teaches User A) as requested in the bonus section.

---

## Proposed Changes

### Project Directory Layout

```text
SideQuest/
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── matchController.js
│   │   ├── swapController.js
│   │   ├── chatController.js
│   │   ├── sessionController.js
│   │   ├── reviewController.js
│   │   ├── adminController.js
│   │   └── notificationController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Skill.js
│   │   ├── SwapRequest.js
│   │   ├── Message.js
│   │   ├── Session.js
│   │   ├── Review.js
│   │   ├── Notification.js
│   │   └── Badge.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── matchRoutes.js
│   │   ├── swapRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── sessionRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   ├── matchingEngine.js
│   │   ├── graphMatchingService.js
│   │   └── gamificationService.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── utils/
│   │   └── seedData.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── client/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── MatchCard.jsx
    │   │   ├── SwapRequestModal.jsx
    │   │   ├── ChatWindow.jsx
    │   │   ├── SessionTrackerCard.jsx
    │   │   ├── SkillBadge.jsx
    │   │   ├── XPBar.jsx
    │   │   ├── ReviewModal.jsx
    │   │   └── UI/
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   ├── SocketContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── MatchDiscoveryPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── SwapRequestsPage.jsx
    │   │   ├── ChatPage.jsx
    │   │   ├── SessionsPage.jsx
    │   │   ├── AdminPage.jsx
    │   │   ├── AnalyticsPage.jsx
    │   │   └── GraphChainPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

### Key Server Components

#### [NEW] [server/models/User.js](file:///e:/1%20Trisha/1%20MSRIT%20COLLEGE/SideQuest/server/models/User.js)
- Fields for full name, username, email, password hash, bio, location, languages, availability (days/times), profile picture, teaching skills, learning skills, XP points, level, unlocked badges, rating metrics, completed swap count, role (`user`/`admin`).

#### [NEW] [server/services/matchingEngine.js](file:///e:/1%20Trisha/1%20MSRIT%20COLLEGE/SideQuest/server/services/matchingEngine.js)
- Implements the weighted matching algorithm:
  - `Teach/Learn Compatibility` (40%): Checks if user A's teach skills match user B's want-to-learn skills, and vice versa.
  - `Skill Level Compatibility` (15%): Evaluates target level fit.
  - `Availability Match` (15%): Compares overlapping schedule slots.
  - `Location Match` (10%): Evaluates city/region proximity or remote preference.
  - `Language Match` (10%): Checks shared spoken languages.
  - `User Rating` (10%): Incorporates rating and trust score.
- Returns overall compatibility score (e.g. `96% Compatible`) and exact match reason bullet points (`✓ You can teach Python`, `✓ They teach Guitar`, `✓ Both available on weekends`).

#### [NEW] [server/services/graphMatchingService.js](file:///e:/1%20Trisha/1%20MSRIT%20COLLEGE/SideQuest/server/services/graphMatchingService.js)
- Directed Graph cycle detector for multi-user indirect skill exchanges (`A → B → C → A`).

#### [NEW] [server/services/gamificationService.js](file:///e:/1%20Trisha/1%20MSRIT%20COLLEGE/SideQuest/server/services/gamificationService.js)
- Awards XP for teaching (+100 XP), learning (+50 XP), completing swaps (+200 XP), receiving 5-star reviews (+150 XP). Checks & unlocks badges automatically.

---

### Key Client Components

#### [NEW] [client/src/pages/DashboardPage.jsx](file:///e:/1%20Trisha/1%20MSRIT%20COLLEGE/SideQuest/client/src/pages/DashboardPage.jsx)
- Central hub displaying active skill swaps, session tracker preview, recommended top matches, recent notifications, and user XP level progress.

#### [NEW] [client/src/pages/MatchDiscoveryPage.jsx](file:///e:/1%20Trisha/1%20MSRIT%20COLLEGE/SideQuest/client/src/pages/MatchDiscoveryPage.jsx)
- Rich grid of match cards with filter panel (category, level, mode, location, language, minimum rating). Shows breakdown pill tags and exact compatibility rationale.

#### [NEW] [client/src/pages/ChatPage.jsx](file:///e:/1%20Trisha/1%20MSRIT%20COLLEGE/SideQuest/client/src/pages/ChatPage.jsx)
- Discord/Linear-styled messaging UI with real-time Socket.io updates, active typing status indicator, online status lights, and image attachment preview.

#### [NEW] [client/src/pages/SessionsPage.jsx](file:///e:/1%20Trisha/1%20MSRIT%20COLLEGE/SideQuest/client/src/pages/SessionsPage.jsx)
- Interactive session tracker with progress bar, session check-off list, collaborative session notes, and rating review trigger upon 100% completion.

#### [NEW] [client/src/pages/AdminPage.jsx](file:///e:/1%20Trisha/1%20MSRIT%20COLLEGE/SideQuest/client/src/pages/AdminPage.jsx) & [AnalyticsPage.jsx](file:///e:/1%20Trisha/1%20MSRIT%20COLLEGE/SideQuest/client/src/pages/AnalyticsPage.jsx)
- Platform management console for account moderation, skills taxonomy management, system stats, charts for popular skills, requested skills, and growth trends.

---

## Verification Plan

### Automated Tests & Verification
1. **Server API Verification**:
   - Run backend server and test Auth, Smart Matching, Swap Request, Chat, Session, and Review endpoints using test scripts or curl/HTTP requests.
2. **Matching Engine Algorithm Validation**:
   - Execute mock score calculation test suite to verify breakdown weights total exactly 100% and rationale strings generate correctly.
3. **Build Verification**:
   - Run `npm run build` on Vite frontend and test for zero TypeScript/JSX errors.

### Manual Verification
1. **User Auth & Profile Flow**: Signup new user, login, edit skills to teach & learn, upload avatar/links, observe XP updates.
2. **Match Engine & Filters**: Filter discovery feed, inspect compatibility match badges, click "View Match Rationale".
3. **Swap Request & Chat Workflow**: Send swap request with custom proposed skill & message -> Accept swap -> Navigate to active chat -> Test real-time message delivery & typing indicator.
4. **Session Progress & Review**: Log completed session -> Reach final session -> Complete swap -> Fill out 6-criteria rating modal -> Verify XP bump and updated user rating.
5. **Admin & Analytics**: Switch to admin view -> Inspect skill analytics, user management, and indirect graph cycle visualization.
