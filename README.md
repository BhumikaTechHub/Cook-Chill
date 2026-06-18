# Cook & Chill  
Cook & Chill is a full-stack web application that combines recipe sharing and entertainment discovery into a single platform. Users can create accounts, explore recipes, save favorites, leave reviews, rate content, and manage their profiles through a secure and responsive interface.

## Live Demo

**Live Application:** https://cook-chill-api.onrender.com

**GitHub Repository:** https://github.com/BhumikaTechHub/Cook-Chill

---

##  Features

### Authentication & Security

* Secure user registration and login
* JWT-based authentication
* Password hashing and protected routes
* Session persistence using HTTP-only cookies

### Recipe Management

* Create, view, edit, and delete recipes
* Categorize recipes by meal type
* Search and discover recipes easily
* Personalized recipe management dashboard

### Reviews & Ratings

* Submit reviews and ratings
* Community-driven feedback system
* Dynamic review and rating management

### Favorites

* Save favorite recipes and entertainment content
* Favorites synchronized with user accounts
* Persistent storage using PostgreSQL

### User Profiles

* Update profile information
* Manage saved content
* Secure password update functionality

### Responsive Design

* Mobile-friendly layouts
* Reusable EJS components
* Optimized user experience across devices

---

##  Tech Stack

### Frontend

* EJS
* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL
* Prisma ORM

### Authentication

* JWT (JSON Web Tokens)
* bcrypt

### Deployment

* Render
* Neon PostgreSQL

---

## Architecture

```text
Client Browser
      │
      ▼
Express + EJS
      │
      ▼
REST API Layer
      │
      ▼
Prisma ORM
      │
      ▼
PostgreSQL (Neon)
```

---

##  Project Structure

```text
Cook-Chill/
├── prisma/
├── public/
│   ├── CSS/
│   ├── JS/
│   ├── IMAGES/
│   └── JSON/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── validation/
│   └── utils/
├── views/
│   ├── pages/
│   └── partials/
├── index.js
├── package.json
└── prisma/schema.prisma
```

---

##  Database Design

The application uses PostgreSQL with Prisma ORM and includes:

* Users
* Recipes
* Reviews
* Ratings
* Favorites

Relationships are managed using Prisma's relational data model for efficient querying and scalability.

---

##  Local Setup

### Clone Repository

```bash
git clone https://github.com/BhumikaTechHub/Cook-Chill.git
cd Cook-Chill
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
PORT=4000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Sync Database

```bash
npx prisma db push
```

### Start Application

```bash
npm start
```

Application will run on:

```text
http://localhost:4000
```

---

##  Key Highlights

* Full-stack application deployed in production
* PostgreSQL database hosted on Neon
* Secure JWT authentication system
* Prisma ORM integration
* Responsive user interface
* Persistent user favorites, ratings, and reviews
* Production deployment using Render

---

##   Future Improvements

* Image upload support for recipes
* Social sharing functionality
* Advanced search and filtering
* Pagination and performance optimization
* Recipe recommendation engine
* Admin dashboard and moderation tools

---

##  Author

**Bhumika Yadav**

LinkedIn: https://www.linkedin.com/in/bhumika-yadav-826255296/

GitHub: https://github.com/BhumikaTechHub

Email: [bhumikay885@gmail.com](mailto:bhumikay885@gmail.com)
