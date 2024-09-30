Event Management API
A basic event management API built with NestJS and MongoDB. This API allows users to create, update, delete, and view events, as well as RSVP to events.

Requirements
Node.js
MongoDB

How to run the project
npm install
Create a .env file:
add the following variables
DATABASE_URL=mongodb://localhost/event
PORT=3000
npm run start:dev

API Endpoints

1. Create Event
   POST /events
   Body:
   {
   "title": "Event Title",
   "description": "Event Description",
   "date": "2025-10-06T10:00:00.000Z"
   }
2. Update Event
   PUT /events/:id
   Body:
   {
   "title": "Updated Title",
   "description": "Updated Description",
   "date": "2025-10-07T12:00:00.000Z"
   }
3. Delete Event
   DELETE /events/:id
4. Get All Events
   GET /events
5. RSVP to Event
   POST /events/:id/rsvp
