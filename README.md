# POS Backend

This is an Express.js application utilizing REST, Sequelize with MySQL, Yup Validation, AWS S3 or local file upload, and authentication/authorization.

## Project Structure

```plaintext
/my-app
├── node_modules/
├── src/
│   ├── config/
│   │   ├── database.js  // Sequelize MySQL configuration
│   │   ├── s3.js  // AWS S3 configuration
│   │   ├── storage.js  // Local and S3 storage configuration
│   │   ├── auth.js  // Authentication configuration
│   │   └── mail.js  // Email configuration (Nodemailer)
│   ├── models/
│   │   ├── user.js  // Sequelize model
│   │   └── product.js  // Sequelize model for product
│   ├── controllers/
│   │   ├── user.js  // Controller for User
│   │   ├── product.js  // Controller for Product
│   │   └── auth.js  // Controller for Auth related operations
│   ├── middleware/
│   │   └── auth.js  // Middleware for Authentication and Authorization
│   ├── routes/
│   │   ├── user.js  // Route for user
│   │   ├── product.js  // Route for product
│   │   └── auth.js  // Route for auth
│   ├── services/
│   │   ├── upload.js  // Services for File upload (Local and S3)
│   │   └── email.js  // Service for sending emails
│   ├── validators/
│   │   ├── user.js  // Yup validation for User
│   │   ├── product.js  // Yup validation for Product
│   │   └── auth.js  // Yup validation for Auth
│   └── app.js
├── uploads/  // Local storage for development/test environment
├── package.json
├── .env  // Environment variables
├── .gitignore
└── README.md
```

## Setup

1. Install dependencies:

    ```
    npm install
    ```

2. Set environment variables:

   Copy the `.env.example` file, rename it to `.env`, and fill out the necessary environment variables.


3. Run the application:

    ```
    npm start
    ```

## Notes

- This app uses Sequelize to interface with a MySQL database.
- Authentication and authorization are handled using JWT.
- AWS S3 or local storage are used for file storage based on the environment.
- Emails are sent using Nodemailer.
- Requests are validated using Yup.