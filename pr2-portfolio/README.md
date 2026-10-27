# pr2-portfolio

**Student:** Jainik Ghetiya  
**Student ID:** 24IT024  
**GitHub Username:** [jainik45](https://github.com/jainik45)  
**Subject:** ITUE301 Advanced Web Development Frameworks  

A modern React 18 + Vite portfolio and Task Manager application built across university practicals P1, P2, P3, P6, P7, and P8.

---

## Practicals Included

1. **Practical 1 – React Components and Props**: Modular components (`Header`, `About`, `Skills`, `Footer`, `NavBar`) with props and clean separation of concerns.
2. **Practical 2 – Routing & State Management**: Client-side routing with React Router v6, dark/light theme switching, and interactive controlled forms.
3. **Practical 3 – External API Integration**: Asynchronous data fetching, loading spinners, error messages, retry mechanism, and search filtering.
4. **Practical 6 – Full-Stack Task Manager**: Integration with Express/MongoDB backend for full CRUD task operations with optimistic feedback, toasts, and confirmation dialogs.
5. **Practical 7 – Authentication & Protected Routes**: JWT authentication, login/registration forms, protected routes, and session expiration handling.
6. **Practical 8 – Performance Optimization**: Code splitting with lazy loading (`lazyWithDelay`), `<Suspense>`, `React.memo`, `useCallback`, and interactive stats bar chart.

---

## How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory (optional, defaults to `http://localhost:5000`):
```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```
The application will be accessible at: `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## Performance (Practical 8)

The table below summarizes measured bundle sizes from `npm run build` before vs. after implementing route-based code splitting and component lazy loading:

| Chunk / Asset | Before Lazy Loading (P7) | After Lazy Loading (P8) | Gzip Size (P8) |
|---|---|---|---|
| **Main JS Bundle** (`index-*.js`) | **185.31 kB** | **170.49 kB** (-14.82 kB) | 55.78 kB |
| **Projects Page** (`Projects-*.js`) | Embedded in main | **10.48 kB** (Lazy chunk) | 3.49 kB |
| **TaskStats Component** (`TaskStats-*.js`) | Embedded in main | **2.49 kB** (Lazy chunk) | 0.90 kB |
| **Login Page** (`Login-*.js`) | Embedded in main | **3.53 kB** (Lazy chunk) | 1.29 kB |
| **Contact Page** (`Contact-*.js`) | Embedded in main | **2.00 kB** (Lazy chunk) | 0.93 kB |
| **NotFound Page** (`NotFound-*.js`) | Embedded in main | **0.32 kB** (Lazy chunk) | 0.26 kB |
| **Shared API module** (`api-*.js`) | Embedded in main | **1.06 kB** | 0.57 kB |

### Key Optimizations:
1. **Initial Load Reduction**: Main bundle decreased by ~15 kB on initial load, speeding up Time-To-Interactive (TTI).
2. **Anti-flicker delay (`lazyWithDelay`)**: Minimum 300 ms resolution prevents jarring layout flicker on fast network connections.
3. **Single Suspense Boundary**: Routes block wrapped cleanly with `<Suspense fallback={<Spinner message="Loading page..." />}>`.
4. **Isolated Component Suspense**: `<TaskStats />` lazy-loaded inside its own Suspense boundary so task controls load immediately.
5. **Render Prevention**: `TaskForm` wrapped in `React.memo`, passing memoized handlers via `useCallback` to prevent unnecessary re-renders.

---

## Commit History

- `Practical 1: React components and props`
- `Practical 2: React routing and state management with dark mode`
- `Practical 3: GitHub API integration with loading, error, retry and search`
- `Practical 6: Full stack integration with Task Manager`
- `Practical 7: JWT authentication on frontend with protected routes`
- `Practical 8: Performance optimization with lazy loading, memo and stats`
