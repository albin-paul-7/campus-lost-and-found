# 🏫 Campus Lost & Found Portal

> **Full Stack MERN Project** developed following the **Information & Communication Technology Academy of Kerala (ICTAK)** Student Reference Guide and Evaluation Guidelines.

[![MERN Stack](https://img.shields.io/badge/Stack-MongoDB%20%7C%20Express%20%7C%20React%20%7C%20Node.js-blue.svg)](https://react.dev/)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61dafb.svg)](https://vitejs.dev/)
[![Express 5](https://img.shields.io/badge/Backend-Express%205%20%2B%20Node%20v24-green.svg)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248.svg)](https://www.mongodb.com/atlas)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

---

## 📋 Table of Contents
1. [Project Overview & Problem Statement](#1-project-overview--problem-statement)
2. [Target Users & Roles](#2-target-users--roles)
3. [MVP Scope & Features](#3-mvp-scope--features)
4. [User Stories & Acceptance Criteria](#4-user-stories--acceptance-criteria)
5. [MERN Architecture & Request Flow](#5-mern-architecture--request-flow)
6. [Project Structure & Separation of Concerns](#6-project-structure--separation-of-concerns)
7. [Data Models & Schema Design](#7-data-models--schema-design)
8. [API Contract Documentation](#8-api-contract-documentation)
9. [Frontend Design & The Four States](#9-frontend-design--the-four-states)
10. [Installation & Local Setup](#10-installation--local-setup)
11. [Environment Variables](#11-environment-variables)
12. [Testing & Verification Guide](#12-testing--verification-guide)
13. [Security, Privacy & Error Handling](#13-security-privacy--error-handling)
14. [Deployment & Production Hosting](#14-deployment--production-hosting)
15. [Project Milestones & Checklist](#15-project-milestones--checklist)
16. [Self-Review Answers (ICTAK Viva Guide)](#16-self-review-answers-ictak-viva-guide)

---

## 1. Project Overview & Problem Statement

### 🎯 Problem Statement
Misplaced belongings—such as student identity cards, scientific calculators, laboratory coats, notebooks, laptop chargers, and keys—frequently circulate unnoticed across campus departments, libraries, lecture halls, and cafeterias. Traditional WhatsApp groups and physical notice boards lead to fragmented communication, duplicated posts, unverified handovers, and privacy risks.

### 💡 The Solution
The **Campus Lost & Found Portal** is a centralized, real-time web platform where university students and faculty can:
- Immediately report misplaced items (**LOST**) with specific campus locations.
- Publish items found on campus (**FOUND**) with photos and contact info.
- Search and filter items by category, keyword, status, and department.
- Submit ownership claim requests with identifying verification details.
- Securely coordinate safe handovers without exposing private credentials.

---

## 2. Target Users & Roles

| Role | Description | Permissions & Capabilities |
| :--- | :--- | :--- |
| **Guest / Visitor** | Any student, teacher, or staff accessing the portal. | • View live campus feed of lost & found posts.<br>• Filter by type (Lost / Found), category, and campus building.<br>• Search items by keyword.<br>• View item descriptions and public contact channels. |
| **Registered User** | Authenticated campus member (Student/Staff). | • All Guest permissions.<br>• Post new **Lost** or **Found** items.<br>• Access personal **My Dashboard** to track, update, or delete reported items.<br>• Mark items as **Claimed** or **Resolved / Returned**.<br>• Submit claim requests on items found by others.<br>• View received claims on their own posted items. |
| **Administrator** | Campus facility or IT administrator. | • Manage reported items, resolve disputes, remove spam/inappropriate posts. |

---

## 3. MVP Scope & Features

### ✅ MVP (Must-Have - Fully Implemented)
- [x] **User Authentication**: Secure Registration & Login using JWT tokens and bcryptjs password hashing.
- [x] **Report Lost / Found Items**: Controlled multi-field form with client & server-side validation.
- [x] **Live Feed & Exploration**: Grid layout with item cards displaying Lost/Found badges, location, date, and category.
- [x] **Dynamic Search & Filtering**: Multi-condition filtering (Lost/Found toggle, 8 item categories, active/resolved status, real-time keyword search).
- [x] **Item Detail View**: Detailed page containing campus location, date, full description, optional photo, and reporter info.
- [x] **Ownership Authorization & Status Lifecycle**: Item owners can toggle status (`active` ↔ `resolved`), edit details, or delete posts.
- [x] **Item Claiming Workflow**: Students can submit verification proof messages directly on found items.
- [x] **Personal Dashboard**: Dedicated "My Reported Items" tabbed view with quick CRUD actions.
- [x] **The Four Essential States**: Loading spinner, Success content, Empty states with next-step CTAs, and Error banners on every screen.
- [x] **Responsive Mobile-First UI**: Seamless layout adaptability across mobile phones, tablets, and desktop displays.

### 🔮 Future Enhancements (Post-MVP)
- Email notifications when a matching item is posted in the same category & location.
- Multi-image file uploads via Cloudinary or AWS S3.
- In-app live chat between finder and claimant.
- Campus single sign-on (SSO) integration using university Google Workspace accounts.

---

## 4. User Stories & Acceptance Criteria

### User Story 1: Report a Found Item
> **As a** campus student who found a misplaced scientific calculator in the library,  
> **I want to** report the item with its location and description,  
> **So that** the rightful owner can identify and recover it.

**Acceptance Criteria:**
- Form requires Title (min 3 chars), Category, Location, Description, and Contact Info.
- If required fields are blank, inline validation errors appear without submitting.
- Submitting saves the item to MongoDB with `status: 'active'`, linked to the authenticated user ID.
- Upon saving, the user is redirected to the item page and it appears immediately on the feed.

### User Story 2: Search and Claim a Lost Item
> **As a** student who lost their blue backpack in the cafeteria,  
> **I want to** filter items by category "Clothing & Bags" and search "cafeteria",  
> **So that** I can find if someone picked it up and submit a claim request.

**Acceptance Criteria:**
- Search and category dropdown update the displayed feed dynamically.
- Non-matching queries show an informative **Empty State** with a "Reset Filters" action.
- Clicking an item opens the full details view.
- Logged-in users can click "Claim This Item" and enter verifying details (e.g. keychains, books inside).

### User Story 3: Manage and Resolve Reports
> **As a** student who reported a lost student ID card,  
> **I want to** mark the post as "Resolved" once it is returned to me,  
> **So that** others know the item has been recovered and the feed stays accurate.

**Acceptance Criteria:**
- Only the item owner or admin can see Edit, Delete, and "Mark Resolved" buttons.
- Other users attempting to edit/delete via API receive a `403 Forbidden` response.
- Clicking "Mark Resolved" updates status to `resolved` and renders a green reunited badge.

---

## 5. MERN Architecture & Request Flow

The application follows the classic decoupled 3-tier MERN stack architecture:

```mermaid
flowchart LR
    subgraph Browser ["Client (Browser - Port 5173)"]
        UI["React 19 UI (Vite)"]
        State["AuthContext & State"]
        APIClient["Axios API Client (services/)"]
    end

    subgraph Server ["Server (Node.js & Express 5 - Port 5000)"]
        MW["Middleware (CORS, JWT Auth, ErrorHandler)"]
        Routes["Express Routes (/api/...)"]
        Controllers["Controllers (auth, item)"]
    end

    subgraph Database ["Database"]
        DB[("MongoDB Atlas Cloud")]
    end

    UI --> State
    State --> APIClient
    APIClient -- "HTTP Requests + Bearer JWT" --> MW
    MW --> Routes
    Routes --> Controllers
    Controllers -- "Mongoose Models" --> DB
    DB -- "BSON Documents" --> Controllers
    Controllers -- "JSON Response (200, 201, 400, etc.)" --> APIClient
    APIClient --> State
    State --> UI
```

### Request Flow Walkthrough (e.g., Reporting an Item)
1. **User Interaction**: User fills the Report form and clicks `Publish Report`.
2. **Frontend Validation**: Client checks field lengths and required values. If valid, `itemService.createItem()` triggers.
3. **HTTP Transport**: Axios attaches `Authorization: Bearer <token>` from `localStorage` and sends `POST /api/items`.
4. **Middleware Processing**:
   - `cors` verifies request origin against whitelist.
   - `express.json()` parses body payload.
   - `protect` middleware extracts the JWT, verifies cryptographic signature, checks user validity in MongoDB, and attaches `req.user`.
5. **Controller & Model Execution**: `itemController.createItem` validates inputs, constructs an `Item` document linked to `req.user._id`, and saves to MongoDB.
6. **Response & UI Update**: Controller responds with status `201 Created` and the populated JSON item. React updates state and navigates to the item page.

---

## 6. Project Structure & Separation of Concerns

```
campus-lost-and-found/
├── .gitignore                    # Root gitignore (ignores node_modules, .env, dist)
├── README.md                     # Comprehensive documentation
├── package.json                  # Root monorepo scripts
│
├── client/                       # Frontend React Application (Vite)
│   ├── .env                      # Local client environment variables
│   ├── .env.example              # Public client environment template
│   ├── index.html                # HTML entry point with metadata
│   ├── package.json              # Client dependencies (React 19, Axios, Router)
│   ├── vite.config.js            # Vite bundler configuration
│   └── src/
│       ├── components/           # Reusable UI components
│       │   ├── ClaimModal.jsx    # Verification claim dialog
│       │   ├── EmptyState.jsx    # Friendly empty state with CTA (State 3)
│       │   ├── ErrorAlert.jsx    # Error alert banner with retry (State 4)
│       │   ├── FilterBar.jsx     # Search input, type pills, category selects
│       │   ├── Footer.jsx        # Campus portal footer & guidelines
│       │   ├── ItemCard.jsx      # Lost/Found card with badges and metadata
│       │   ├── LoadingSpinner.jsx# Animated loading indicator (State 1)
│       │   ├── Navbar.jsx        # Responsive navigation with auth controls
│       │   └── ProtectedRoute.jsx# Route guard redirecting to login
│       ├── context/
│       │   └── AuthContext.jsx   # Shared authentication state & methods
│       ├── pages/                # Route-level screens
│       │   ├── EditItem.jsx      # Form to edit existing report
│       │   ├── Home.jsx          # Hero section, stats, search & feed grid
│       │   ├── ItemDetail.jsx    # Full item details, claims, and actions
│       │   ├── Login.jsx         # Sign in card with validation
│       │   ├── MyItems.jsx       # Personal dashboard with tabbed filters
│       │   ├── NotFound.jsx      # 404 page
│       │   ├── Register.jsx      # Account registration card
│       │   └── ReportItem.jsx    # Form to post lost or found items
│       ├── services/             # Central API communication layer
│       │   ├── api.js            # Axios client with interceptors
│       │   ├── authService.js    # Auth HTTP requests
│       │   └── itemService.js    # Item CRUD HTTP requests
│       ├── App.css               # Comprehensive responsive design styles
│       ├── index.css             # Theme design variables and resets
│       ├── App.jsx               # Router & application layout
│       └── main.jsx              # React DOM render entry
│
└── server/                       # Backend Express API (Node.js)
    ├── .env                      # Private environment variables (DB URI, JWT)
    ├── .env.example              # Public server environment template
    ├── package.json              # Server dependencies (Express, Mongoose, JWT)
    ├── server.js                 # Root entry bridge
    └── src/
        ├── config/
        │   └── db.js             # Mongoose connection & error logging
        ├── controllers/
        │   ├── authController.js # Register, login, getMe, updateProfile
        │   └── itemController.js # getItems, create, update, delete, claim
        ├── middleware/
        │   ├── authMiddleware.js # JWT verification & role authorization
        │   └── errorMiddleware.js# Central error handler & 404 middleware
        ├── models/
        │   ├── Item.js           # Lost/Found Item schema & claim subdocuments
        │   └── User.js           # User schema with bcrypt password hashing
        ├── routes/
        │   ├── authRoutes.js     # URL mappings for /api/auth
        │   └── itemRoutes.js     # URL mappings for /api/items
        └── server.js             # Express app setup, CORS, and listeners
```

### Separation of Concerns Checklist (ICTAK Section 4)
- **Routes**: Solely map HTTP paths to controllers (`router.post('/login', login)`). No business logic.
- **Controllers**: Handle request inputs, invoke models, shape JSON responses, and forward errors.
- **Models**: Define data schemas, constraints, field types, indexes, and validation rules.
- **Middleware**: Cross-cutting concerns—JWT authentication, CORS whitelisting, and centralized error normalization.
- **API Client (`services/`)**: Centralized HTTP client. Components never hardcode fetch URLs.
- **Components**: Responsible for UI rendering, controlled forms, and user feedback.

---

## 7. Data Models & Schema Design

### 👤 User Model (`server/src/models/User.js`)
```javascript
{
  name: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, trim: true, default: '' },
  department: { type: String, trim: true, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  timestamps: true // createdAt, updatedAt
}
```

### 📦 Item Model (`server/src/models/Item.js`)
```javascript
{
  title: { type: String, required: true, trim: true, minlength: 3 },
  description: { type: String, required: true, trim: true, minlength: 5 },
  type: { type: String, enum: ['lost', 'found'], required: true },
  category: { 
    type: String, 
    required: true, 
    enum: [
      'Electronics', 'Books & Notes', 'ID Cards & Wallets', 
      'Clothing & Bags', 'Keys', 'Bottles & Accessories', 
      'Jewelry & Watches', 'Other'
    ] 
  },
  location: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
  contactInfo: { type: String, required: true, trim: true },
  imageUrl: { type: String, default: '' },
  status: { type: String, enum: ['active', 'claimed', 'resolved'], default: 'active' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  claims: [
    {
      claimant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      claimantName: { type: String, required: true },
      claimantContact: { type: String, required: true },
      message: { type: String, required: true },
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  timestamps: true
}
```
*Compound indexes created on `{ title: 'text', description: 'text', location: 'text' }` and `{ type: 1, category: 1, status: 1 }` for high-performance querying.*

---

## 8. API Contract Documentation

All endpoints are prefixed with `/api`. Consistent response structures are maintained across all routes.

| Method | Endpoint | Description | Auth Required | Success Status | Error Status Codes |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/auth/register` | Register new user account | No | `201 Created` | `400` Missing/short input<br>`409` Email already registered |
| `POST` | `/api/auth/login` | Authenticate and retrieve JWT token | No | `200 OK` | `400` Missing fields<br>`401` Invalid credentials |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer) | `200 OK` | `401` Token missing/expired |
| `PUT` | `/api/auth/profile` | Update user profile details | Yes (Bearer) | `200 OK` | `400` Bad input<br>`401` Unauthorized |
| `GET` | `/api/items` | List items (with search, type, category, status, pagination) | No | `200 OK` | `500` Server error |
| `GET` | `/api/items/stats` | Retrieve total, lost, found, and resolved counts | No | `200 OK` | `500` Server error |
| `GET` | `/api/items/:id` | Get full details of a specific item | No | `200 OK` | `404` Item not found |
| `POST` | `/api/items` | Report a new Lost or Found item | Yes (Bearer) | `201 Created` | `400` Validation failure<br>`401` Unauthorized |
| `PUT` | `/api/items/:id` | Update an existing item report | Yes (Bearer) | `200 OK` | `400` Invalid input<br>`403` Not item owner<br>`404` Not found |
| `DELETE` | `/api/items/:id` | Delete an item report | Yes (Bearer) | `200 OK` | `403` Not item owner<br>`404` Not found |
| `PATCH` | `/api/items/:id/status` | Update item status (`active`, `claimed`, `resolved`) | Yes (Bearer) | `200 OK` | `400` Invalid status<br>`403` Not owner |
| `POST` | `/api/items/:id/claim` | Submit an ownership verification claim | Yes (Bearer) | `201 Created` | `400` Missing proof note<br>`401` Unauthorized |
| `GET` | `/api/items/user/my-items`| Fetch items posted by logged-in user | Yes (Bearer) | `200 OK` | `401` Unauthorized |

---

## 9. Frontend Design & The Four States

In accordance with **ICTAK Section 7.3**, every screen handles all four states:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LOADING: Custom SVG Spinner with descriptive message      │
├─────────────────────────────────────────────────────────────┤
│ 2. SUCCESS: Clean, responsive UI with color-coded badges    │
├─────────────────────────────────────────────────────────────┤
│ 3. EMPTY:   Polished empty illustration, friendly copy,     │
│             and direct Call-To-Action button                │
├─────────────────────────────────────────────────────────────┤
│ 4. ERROR:   Non-technical alert banner with "Retry" action  │
└─────────────────────────────────────────────────────────────┘
```

### Visual Highlights
- **Lost Badge**: High-visibility rose/red pill badge (`#fef2f2` / `#dc2626`).
- **Found Badge**: Emerald green pill badge (`#f0fdf4` / `#16a34a`).
- **Resolved Indicator**: Gray/slate badge with recovery rate calculator.
- **Controlled Forms**: Visual error highlights on invalid inputs, disabled submit buttons with spinner while requests are pending.
- **Accessibility**: Full keyboard navigability, semantic HTML (`header`, `main`, `nav`, `section`, `footer`), clear labels, and WCAG AA contrast compliance.

---

## 10. Installation & Local Setup

### ⚙️ Prerequisites
- **Node.js**: v18.0.0 or higher (v24.x tested)
- **npm**: v9.0.0 or higher
- **MongoDB**: MongoDB Atlas connection string (or local MongoDB instance)
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/campus-lost-and-found.git
cd campus-lost-and-found
```

### Step 2: Configure Environment Variables
Create the environment files from the provided templates:

```bash
# Server environment
cp server/.env.example server/.env

# Client environment
cp client/.env.example client/.env
```
*(Open `server/.env` and ensure `MONGO_URI` and `JWT_SECRET` are set).*

### Step 3: Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 4: Run the Application Locally

Open two terminal windows:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# Server runs on: http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# React Vite Client runs on: http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser!

---

## 11. Environment Variables

### 🔒 Server (`server/.env`)
| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `PORT` | No | Port on which the API listens (defaults to 5000) | `5000` |
| `NODE_ENV` | No | Runtime environment mode | `development` / `production` |
| `MONGO_URI` | **Yes** | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | **Yes** | Secret cryptographic key for signing JWT tokens | `your_secure_random_jwt_secret_key` |
| `CLIENT_URL` | No | Frontend origin URL for CORS policy | `http://localhost:5173` |

### 🌐 Client (`client/.env`)
| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL`| **Yes** | Base URL for the Express API | `http://localhost:5000/api` |

> ⚠️ **Security Reminder**: `.env` files are ignored in `.gitignore`. Only `.env.example` templates are tracked in Git. Never place production passwords or secret keys in frontend variables or repository commits.

---

## 12. Testing & Verification Guide

### 1. API Verification with cURL

#### Health Check
```bash
curl -X GET http://localhost:5000/api/health
# Response: {"uptime": ..., "status": "healthy"}
```

#### User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Arun Kumar",
    "email": "arun@campus.edu",
    "password": "password123",
    "department": "Computer Science"
  }'
```

#### User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "arun@campus.edu",
    "password": "password123"
  }'
# Returns: { "success": true, "token": "<JWT_TOKEN>", "user": {...} }
```

#### Post a Found Item
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "title": "Scientific Calculator Casio fx-991EX",
    "description": "Found on the 2nd bench of Electrical Lab A.",
    "type": "found",
    "category": "Electronics",
    "location": "Electrical Lab A, 1st Floor",
    "contactInfo": "Submit claim or contact lab assistant"
  }'
```

#### Retrieve Filtered Items
```bash
curl -X GET "http://localhost:5000/api/items?type=found&category=Electronics"
```

### 2. Frontend Production Build Verification
Verify production bundle compilation:
```bash
cd client
npm run lint
npm run build
```
*(Produces optimized static assets in `client/dist/` with zero lint errors).*

---

## 13. Security, Privacy & Error Handling

- **Password Hashing**: Passwords are cryptographically salted and hashed using `bcryptjs` with cost factor 10. Plain text passwords are never stored, logged, or returned.
- **JWT Authorization**: Sensitive operations (reporting, editing, deleting, claiming) require a signed JSON Web Token passed in the `Authorization: Bearer <token>` header.
- **Server-Side Ownership Enforcement**: Controllers explicitly verify that `item.postedBy.toString() === req.user._id.toString()` before permitting update or deletion operations.
- **Centralized Error Handling**: Express middleware intercepts unhandled exceptions, Mongoose validation errors, duplicate keys (`code: 11000`), and CastErrors, responding with structured JSON while concealing sensitive server stack traces in production.
- **NoSQL Injection Defense**: MongoDB queries use sanitised parameter binding rather than raw user objects.
- **CORS Whitelisting**: The API configures CORS headers to permit incoming requests only from verified frontend origins.

---

## 14. Deployment & Production Hosting

### Architecture
- **Frontend**: Hosted on **Vercel** or **Render Static Site**.
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - SPA Fallback: Configured `vercel.json` rewrite:
    ```json
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
    }
    ```
- **Backend API**: Hosted on **Render** (Web Service) or **Railway**.
  - Build Command: `npm install`
  - Start Command: `node src/server.js`
  - Environment Variables: Set `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL=https://your-frontend.vercel.app`.
- **Database**: **MongoDB Atlas** M0 Free Tier cluster with IP access whitelist (`0.0.0.0/0` with secure username/password).

---

## 15. Project Milestones & Checklist

| # | Milestone | Target | Status |
| :-: | :--- | :--- | :-: |
| **1** | Project Defined | Problem statement, user stories, data models, and API contract | ✅ Complete |
| **2** | Repository & Skeleton | Git repo with `.gitignore`, client & server folder separation | ✅ Complete |
| **3** | Database & Models | User and Item Mongoose schemas, relationships, and validation | ✅ Complete |
| **4** | Auth & Security | JWT registration, login, bcryptjs password hashing, auth middleware | ✅ Complete |
| **5** | Item REST API | Full CRUD endpoints, filtering, keyword search, status update, claims | ✅ Complete |
| **6** | Frontend Components | Navbar, Footer, ItemCard, FilterBar, ClaimModal, ProtectedRoute | ✅ Complete |
| **7** | Route Screens | Home Feed, Item Details, Report Form, Edit Form, Dashboard, Auth | ✅ Complete |
| **8** | Integration & 4 States | Central API client, loading spinners, empty states, error alerts | ✅ Complete |
| **9** | Production Verification | Zero ESLint errors, successful Vite production build (`dist/`) | ✅ Complete |

---

## 16. Self-Review Answers (ICTAK Viva Guide)

*Answers prepared in accordance with Section 14 of the ICTAK Student Reference Guide:*

1. **Can I explain the problem my project solves and who it is for in two sentences?**  
   *Answer:* The Campus Lost & Found Portal provides university students and faculty with a unified, searchable platform to report and recover lost belongings across campus facilities. It eliminates messy WhatsApp spam and notice boards by verifying ownership claims and providing real-time item status tracking.

2. **Does the MVP work from start to finish without manual workarounds?**  
   *Answer:* Yes. A user can register, log in, post a lost/found item, search and filter the feed, view full item details, file a claim request, and mark the item as resolved—all functioning seamlessly end-to-end.

3. **Can I trace one request from the React component to the database and back?**  
   *Answer:* Yes. For example, reporting an item: `ReportItem.jsx` dispatches `itemService.createItem()` via Axios with a Bearer token; Express intercepts via `cors` and `express.json()`; `authMiddleware` validates the JWT and loads `req.user`; `itemController.createItem` validates inputs and saves to MongoDB using `Item.create()`; Mongoose returns the saved document; the controller sends `201 Created` JSON; and React updates the state and redirects the user.

4. **What happens if the user enters bad input, loses internet, or the API fails?**  
   *Answer:* The frontend performs immediate controlled form validation preventing submission of empty/invalid data. If the network drops or the API returns an error, the `ErrorAlert` component renders a clear, non-technical explanation accompanied by a "Retry" button.

5. **Which data is protected, and how do I stop one user from reaching another user's data?**  
   *Answer:* Passwords and JWT secrets are protected. Item modification and deletion are protected on the server side: `itemController` verifies `item.postedBy.toString() === req.user._id.toString()`. Unauthorized attempts trigger `403 Forbidden`.

6. **Where are my secrets stored, and could anyone find them in the browser or on GitHub?**  
   *Answer:* Secrets (`MONGO_URI`, `JWT_SECRET`) reside exclusively in server `.env` files which are excluded from Git via `.gitignore`. Frontend variables only store non-sensitive public configuration (`VITE_API_URL`).

7. **Does it work well on a phone and with a keyboard only?**  
   *Answer:* Yes. Mobile navigation features a responsive hamburger menu, cards resize adaptively via CSS grid, and all interactive controls, forms, and modals support standard Tab, Enter, and Escape keyboard navigation.

8. **Can someone else clone my repository and run the project by following my README?**  
   *Answer:* Yes. Section 10 provides comprehensive, step-by-step instructions from `git clone` and environment variable setup to running both server and client.

9. **What would break first if the number of users grew tenfold?**  
   *Answer:* Database search queries and image payload volume. This would be mitigated by implementing database pagination cursor caching, Redis caching for the statistics endpoint, and offloading user image uploads to an external object store like Cloudinary or AWS S3.

10. **What would I improve next, and why?**  
    *Answer:* Real-time notifications via WebSockets or email alerts whenever an item matching a student's lost report category is found in the same campus building.

---

### 🎓 Acknowledgments
Developed by **Campus Lost & Found Team** under the guidance of **Information & Communication Technology Academy of Kerala (ICTAK)** Full Stack MERN Development Curriculum.
