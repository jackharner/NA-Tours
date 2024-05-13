This is a Web application for a tour listing company. Users can visit the site to browse for and sign up for a tour.

Project features:
- Routing
- MongoDB database with access via Mongoose
- API made with Express.js to access database
- error handling
- Authentication, Authorization, and Security: JWT sent via HTTPOnly cookie, rate limiting, HTTP security headers, Data Sanitization, preventing parameter pollution, hashed passwords, limiting payload size, XSS protection
- Server-side rendering with Pug templates
- image uploads
- emails
- credit card payments with Stripe

Technologies used:
- Node.js, Express.js, MongoDB, Mongoose, JavaScript, REST API



Project setup:
1) Create and connect MongoDB Database
2) to get the map component to work, enter a MapBox API key (not necessary in future iteration)
3) Create a "config.env" file at the top-level with the required secrets

Start Server (view mode, not development mode):
- run the command "npm Start"

Start the server in development mode:
1) run the command "npm watch:js" to make Webpack listen for updates
2) in a separate terminal run the command "npm start"

View Application:
open browser to 127.0.0.1:3000