# ✈️ Flight Booking System

Full-stack flight booking application with Spring Boot and React.

![Java](https://img.shields.io/badge/Java_17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Test Accounts](#test-accounts)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Milestone Journey](#milestone-journey)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## ✨ Features

### Customer Features
- 🔐 **User Authentication** - Secure registration and login with JWT
- 🔍 **Flight Search** - Search flights by origin, destination, and date
- 👥 **Multi-Passenger Booking** - Book for 1-9 passengers in one transaction
- 📝 **Booking Management** - View and cancel flight reservations
- 👤 **Profile Management** - View and edit personal information
- 🔑 **Password Management** - Change password securely
- 🎫 **Booking History** - View all past and current bookings

### Admin Features
- ✈️ **Flight Management** - Add and delete flight schedules
- 📊 **Analytics Dashboard** - View revenue, popular routes, and seat occupancy
- 👥 **View All Bookings** - Monitor all customer bookings
- 💰 **Revenue Tracking** - Real-time revenue reports
- 📈 **Route Analytics** - Track most popular flight routes

### System Features
- 🛡️ **Double-Booking Prevention** - Ensures no overbooking
- 🔒 **Role-Based Access Control** - Customer vs Admin permissions
- ⚡ **Loading States** - User-friendly loading spinners
- ❗ **Error Handling** - Comprehensive error messages
- 📱 **Responsive Design** - Works on all device sizes

## 🛠️ Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- Spring Security (JWT Authentication)
- BCrypt (Password Encryption)
- MySQL 8.0
- Maven

**Frontend:**
- React 18
- JavaScript (ES6+)
- Bootstrap 5
- Axios
- React Router

**Authentication:**
- JWT (JSON Web Tokens)
- BCrypt password hashing

## 📦 Prerequisites

Before running this project, make sure you have:

- **Java 17+** - [Download here](https://www.oracle.com/java/technologies/downloads/)
- **Node.js 16+** and npm - [Download here](https://nodejs.org/)
- **MySQL 8.0+** - [Download here](https://dev.mysql.com/downloads/)
- **Maven** (usually bundled with Spring Boot)
- **Git** - [Download here](https://git-scm.com/downloads)

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/KhushiLakhlani/flight-booking-system.git
cd flight-booking-system
```

### 2. Database Setup

Open MySQL and create the database:
```bash
mysql -u root -p
```

In MySQL shell:
```sql
CREATE DATABASE flight_booking_db;
exit;
```

Configure database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/flight_booking_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.jpa.hibernate.ddl-auto=update
```

### 3. Run Backend

Navigate to backend directory and start the server:
```bash
cd backend
./mvnw spring-boot:run
```

**Backend runs on:** `http://localhost:8080`

**Note:** If you're on Windows and `./mvnw` doesn't work, use:
```bash
mvnw.cmd spring-boot:run
```

### 4. Run Frontend

Open a **new terminal** and navigate to frontend:
```bash
cd frontend
npm install
npm start
```

**Frontend opens on:** `http://localhost:3000`

The application will automatically open in your default browser.

## 🔑 Test Accounts

### Admin Account
- **Email:** `admin@flight.com`
- **Password:** `admin123`
- **Access:** Flight management, analytics dashboard, view all bookings

### Customer Account
- **Register at:** `http://localhost:3000/register`
- **Access:** Search flights, book tickets, manage bookings, edit profile

## 📊 System Architecture
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │ ◄─────► │  Spring Boot    │ ◄─────► │  MySQL Database │
│  (Port 3000)    │  REST   │  Backend API    │  JPA    │                 │
│  + Bootstrap 5  │  + JWT  │  (Port 8080)    │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## 📁 Project Structure
```
flight-booking-system/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/edu/neu/csye6200/
│   │   │   │   ├── config/          # Security & CORS configuration
│   │   │   │   ├── controller/      # REST API controllers
│   │   │   │   ├── model/           # JPA entities (4 entities)
│   │   │   │   ├── repository/      # Data repositories
│   │   │   │   ├── service/         # Business logic
│   │   │   │   ├── dto/             # Data transfer objects
│   │   │   │   └── security/        # JWT utilities
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   └── mvnw
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── pages/                   # 9 page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Home.js
│   │   │   ├── SearchFlights.js
│   │   │   ├── BookFlight.js
│   │   │   ├── MyBookings.js
│   │   │   ├── Profile.js
│   │   │   ├── AdminDashboard.js
│   │   │   └── Analytics.js
│   │   ├── services/                # API calls
│   │   │   ├── authService.js
│   │   │   ├── flightService.js
│   │   │   └── bookingService.js
│   │   ├── utils/                   # Helper functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register           - Register new user
POST   /api/auth/login              - User login (returns JWT)
GET    /api/auth/profile            - Get current user profile
```

### Flight Endpoints
```
GET    /api/flights                 - Get all flights
GET    /api/flights/{id}            - Get flight by ID
POST   /api/flights/search          - Search flights by criteria
POST   /api/flights                 - Add new flight (Admin only)
DELETE /api/flights/{id}            - Delete flight (Admin only)
```

### Booking Endpoints
```
GET    /api/bookings                - Get user's bookings
GET    /api/bookings/{id}           - Get booking details
POST   /api/bookings                - Create new booking (1-9 passengers)
DELETE /api/bookings/{id}           - Cancel booking
GET    /api/bookings/all            - Get all bookings (Admin only)
```

### User Endpoints
```
GET    /api/users/profile           - Get user profile
PUT    /api/users/profile           - Update user profile
PUT    /api/users/change-password   - Change password
```

### Analytics Endpoints (Admin)
```
GET    /api/analytics/revenue       - Total revenue
GET    /api/analytics/popular-routes - Most booked routes
GET    /api/analytics/occupancy     - Seat occupancy rates
```

**Total: 20+ API endpoints**

## 🎯 Core Entities

The system uses **4 main entities** with proper JPA relationships:

1. **User** - Customer and Admin accounts
   - Fields: id, username, email, password, firstName, lastName, role
   - Relationships: One-to-Many with Bookings

2. **Flight** - Flight schedule information
   - Fields: id, flightNumber, airline, origin, destination, departureTime, arrivalTime, price, totalSeats, availableSeats, status
   - Relationships: One-to-Many with Bookings

3. **Booking** - Flight reservations
   - Fields: id, bookingDate, totalPrice, numberOfPassengers, status
   - Relationships: Many-to-One with User and Flight, One-to-Many with Passengers

4. **Passenger** - Individual passenger details
   - Fields: id, firstName, lastName, email, age, passportNumber, seatNumber
   - Relationships: Many-to-One with Booking

## 📸 Screenshots

### Home Page


### Flight Search


### Booking Page


### Admin Dashboard


### Analytics


## 🎯 OOP Concepts Implemented

- **Encapsulation** - Private fields with getters/setters in entities
- **Inheritance** - Base entity classes, service layer hierarchy
- **Polymorphism** - Interface implementations, method overriding
- **Abstraction** - Service interfaces, repository patterns
- **Composition** - Entity relationships (User has many Bookings)
- **Dependency Injection** - Spring's @Autowired and constructor injection

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ BCrypt password encryption
- ✅ Role-based access control (RBAC)
- ✅ Protected API endpoints
- ✅ CORS configuration for frontend-backend communication
- ✅ SQL injection prevention via JPA
- ✅ XSS protection

## 📈 Milestone Journey - Brief Summary

### Milestone 1: Planning and Design
1. ✅ Designed UML and ER diagrams
2. ✅ Defined system requirements and problem statement
3. ✅ Selected tech stack (Java, Spring Boot, React, MySQL)
4. ✅ Identified OOP concepts for implementation
5. ✅ Created GitHub repository and project structure

### Milestone 2: Core Implementation
1. ✅ Built Spring Boot backend with **4 entities** and **20+ APIs**
2. ✅ Implemented **JWT authentication** and **BCrypt encryption**
3. ✅ Developed React frontend with **9 pages**
4. ✅ Created **multi-passenger booking system** (1-9 passengers)
5. ✅ Built **admin dashboard** (add/delete flights, view all bookings)
6. ✅ Implemented **role-based access** (Customer vs Admin)
7. ✅ Added **double-booking prevention**
8. ✅ Integrated MySQL database with proper relationships

### Milestone 3: Enhancements and Final Functionalities
1. ✅ Added **user profile management** (view, edit)
2. ✅ Implemented **change password feature**
3. ✅ Integrated **Bootstrap 5** for professional UI/UX
4. ✅ Built **admin analytics dashboard** (revenue, routes, occupancy)
5. ✅ Added **loading spinners** and **error handling**
6. ✅ Created **responsive design** for all pages

## 🎓 Academic Context

This project was developed as part of **CSYE 6200 - Object-Oriented Design** at Northeastern University. It demonstrates:
- Full-stack application development
- Object-oriented programming principles
- RESTful API design
- Modern web development practices
- Database design and relationships
- Security best practices

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications for booking confirmations
- [ ] Seat selection with visual seat map
- [ ] Multi-city flight bookings
- [ ] Flight status tracking
- [ ] Review and rating system
- [ ] Mobile application (React Native)
- [ ] Advanced search filters
- [ ] Loyalty rewards program
- [ ] PDF ticket generation

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
./mvnw test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

## 👩‍💻 Author

**Khushi Lakhlani**
- GitHub: [@KhushiLakhlani](https://github.com/KhushiLakhlani)
- LinkedIn: [khushilakhlani](https://www.linkedin.com/in/khushilakhlani/)
- Portfolio: [khushi-portfolio-nextjs.vercel.app](https://khushi-portfolio-nextjs.vercel.app/)
- Email: lakhlani.k@northeastern.edu

## 🙏 Acknowledgments

- Northeastern University - CSYE 6200 Course
- Spring Boot Documentation
- React Documentation
- Bootstrap Documentation
- Open source community

## 📧 Contact

For questions or feedback:
- **Email:** lakhlani.k@northeastern.edu
- **GitHub Issues:** [Create an issue](https://github.com/KhushiLakhlani/flight-booking-system/issues)

## 🔍 Keywords

`java` `spring-boot` `react` `mysql` `jwt-authentication` `full-stack` `flight-booking` `rest-api` `bootstrap` `maven` `jpa` `hibernate` `responsive-design` `crud-application` `object-oriented-design` `northeastern-university` `academic-project`
