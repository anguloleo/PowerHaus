# PowerHaus
Check out a live version of PowerHaus here: [PowerHaus Live](https://powerhaus-dres.onrender.com/)

PowerHaus is a gym management and workout tracking web application. The backend is built with **Node.js** and **Express**, using **PostgreSQL** for database storage. The frontend is powered by **React**, with state management handled by **Redux** and **Context API** for seamless data flow.

---

## Features & Implementation

### Single-Page App
**React Router and Components**

PowerHaus is a single-page app (SPA). All pages are rendered dynamically at the root URL `/` via React components. Navigation between views is handled by **React Router**, while components re-render efficiently using the React API.

---

### Frontend and Backend Interaction

The frontend communicates with the backend for CRUD operations on users, workouts, classes, and gym equipment. Key data is cached on the frontend to reduce unnecessary server requests and ensure smooth UI updates.

---

### Authentication

**Auth Page**

Users must authenticate to access gym features. Unauthenticated navigation redirects to the login page. Passwords are hashed with **bcrypt** before being stored in the database.

**Social Authentication (Future)**

OAuth login via Google and Facebook is planned for future releases. Social accounts will link securely to existing user profiles.

---

### User & Gym Management

**User Model**

The `users` table stores `username`, `email`, `password_digest`, and `membership_status`. This supports tracking membership level, access privileges, and personalized workout data.

**Workout CRUD**

Users can create, view, update, and delete workouts. Each workout includes exercises, sets, reps, and duration. Workouts are associated with the user who created them.

**Class & Equipment CRUD**

Admins manage gym classes and equipment availability. Classes have `name`, `instructor`, `schedule`, and `capacity`. Equipment has `name`, `type`, and `availability_status`.

---

### Workout Tracking & Analytics

**Progress Tracking**

Users log completed workouts and monitor performance over time. Metrics include total sets/reps, duration, and personal bests.

**Dashboard**

The dashboard aggregates workout activity, class attendance, and progress trends. Dynamic charts and tables provide real-time feedback to users.

---

### Screenshots

**Home Preview**  
![Dashboard](https://lodgr.s3.us-east-2.amazonaws.com/Screenshot+2025-08-27+165806.png)

**Metric Logging**  
![Metric Log](https://lodgr.s3.us-east-2.amazonaws.com/Screenshot+2025-08-27+165854.png)
(https://lodgr.s3.us-east-2.amazonaws.com/Screenshot+2025-08-27+165854.png)

**Class Schedule**  
![Class Schedule](./docs/class-schedule.png)

(https://lodgr.s3.us-east-2.amazonaws.com/Screenshot+2025-08-27+165907.png)
(https://lodgr.s3.us-east-2.amazonaws.com/Screenshot+2025-08-27+165922.png)
(https://lodgr.s3.us-east-2.amazonaws.com/Screenshot+2025-08-27+165943.png)
(https://lodgr.s3.us-east-2.amazonaws.com/Screenshot+2025-08-27+165951.png)

---

### Future Features

Planned features include:

- Social features (friends, shared workouts, leaderboards)  
- Subscription and membership payments  
- Mobile app version for workout tracking  
- Advanced analytics and personalized recommendations  
- Class booking and cancellation system

---

### Tech Stack

- **Frontend:** React, Redux, React Router, Context API  
- **Backend:** Node.js, Express, PostgreSQL, Sequelize ORM  
- **Authentication:** Bcrypt for password hashing, JWT for sessions  
- **Styling:** CSS3, Flexbox, Grid  
- **Deployment:** Heroku / Vercel (planned)
