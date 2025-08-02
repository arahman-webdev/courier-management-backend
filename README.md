# Project Overview

Parcel Delivery API is a secure, role-based backend system built with Node.js, Express, TypeScript, and MongoDB, designed to manage a parcel delivery workflow similar to popular logistics platforms.

This system allows different user roles — Admin, Sender, and Receiver — to interact with parcels based on permissions. Key features include parcel creation, tracking, status updates, delivery confirmation, blocking/unblocking, and advanced filtering with search capabilities.

The backend ensures robust data validation, modular architecture, and scalable design principles following RESTful conventions.

# Key Features------------------------------

# Authentication & Role-Based Authorization

1. Secure JWT-based login

2. User roles: admin, sender, receiver

# Parcel Operations

1. Create, cancel, reschedule parcels

2. Track parcel delivery status

3. Confirm delivery

4. Return or block/unblock parcels (by authorized roles)

# Status Logs & Tracking

1. Full history of parcel status transitions

2. Admin can view and manage all logs

3. Public tracking via trackingId

# Advanced Filtering & Search

1. Filter parcels by status or delivery date

2. Search by fields using query parameters

# Comprehensive Testing

1. Fully tested with Postman



# Clean Modular Codebase

1. Feature-based folder structure

2. TypeScript interfaces and enums for maintainability

3. Centralized error handling and utilities

# Tech Stack

1. Node.js
2. Express.js
3. Mongodb via mongoose
4. Typescript

# How to run this in locally
Clone the repo: git colne https://github.com/arahman-webdev/courier-management-backend.git
cd your project name.

# Install dependecies
npm install #  or yarn install
install dependencies
Create your env file
And then npm run dev

# For production 
1. npm run build
2. npm run start


# Auth Routes

1. POST	/auth/register	Register as sender or receiver by	Public
2. POST	/auth/login	Login with email and password	by Public


# User Routes

1. GET	     /users	      Get all users	                  by Admin
2. PATCH	 /users/:id	Update user info	              by Self / Admin
3. PATCH	 /users/block/:id	Block or unblock a user	  by Admin


# Parcel Routes 

1. POST	/parcels	                       Create a new parcel	          by  Sender
2. GET	/parcels	                       Get parcels of logged-in user  by Sender/Receiver
3. PATCH	/parcels/cancel/:id	           Cancel a parcel	              by  Sender
4. PATCH	/parcels/status/:id	           Update status of parcel	      by  Admin
5. PATCH	/parcels/confirm/:id	       Confirm delivery	              by  Receiver
6. PATCH	/parcels/block/:id	           Block a parcel	              by  Admin
7. PATCH	/parcels/unblock/:id	       Unblock a parcel	              by  Admin
8. PATCH	/parcels/return/:id	           Return a parcel	              by  Admin
9. PATCH	/parcels/reschedule/:id	       Reschedule delivery	          by  Admin/Sender
10. GET	    /parcels/log/:id	           See parcel status log	      by  Admin/Sender/Receiver
11. GET	    /parcels/track/:trackingId	   Track parcel by tracking ID	  by  Public
12. DELETE	/parcels/:id	               Delete a parcel	              by  Admin

If you need help or want to connect

Abdur rahman
    📧 mdarahman5645@gmail.com
    🌍 Sherpur, Bogura, Bangladesh
    👨‍💻 GitHub: https://github.com/arahman-webdev

