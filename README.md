# Smart Doctor Appointment System 🏥

A comprehensive, full-stack medical appointment management system designed for seamless interactions between patients and doctors. Features include real-time scheduling, secure payments, and a premium, responsive UI.

## 🚀 Key Features

- **Patient Dashboard**: Easy browsing of doctors, specialization-based filtering, and appointment booking.
- **Doctor Management**: Specialized doctor profiles with availability management.
- **Secure Payments**: Integrated Razorpay for safe and easy transaction processing.
- **Real-time Notifications**: Email confirmations via Nodemailer for appointments.
- **Admin Panel**: Complete control over appointments, users, and system settings.
- **Premium UI**: Built with React, Tailwind CSS, and Framer Motion for a sleek, modern experience.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Redux Toolkit, React Router, Headless UI, Heroicons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT (JSON Web Tokens) with BcryptJS.
- **Cloud Storage**: Cloudinary (for profile and medical images).
- **Payments**: Razorpay.
- **Emails**: Nodemailer.

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Local or Atlas)
- **Git**

### 2. Clone the Repository
```bash
git clone <repository-url>
cd smart-doctor
```

### 3. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add the following:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   
   # Email Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_specific_password
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

### 4. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder and add the following:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_IMAGE_URL=http://localhost:5000
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
smart-doctor/
├── backend/            # Express.js backend
│   ├── src/            # Backend source code
│   │   ├── controllers/# Route handlers
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # API endpoints
│   │   └── middleware/ # Custom middleware
│   └── server.js       # Entry point
├── frontend/           # React frontend
│   ├── src/            # React components and logic
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page-level components
│   │   ├── store/      # Redux state management
│   │   └── assets/     # Images and styles
│   └── index.html      # HTML entry
└── README.md           # Project documentation
```

## 🤝 Contributing
Feel free to fork this project, open issues, and submit pull requests to help improve the system.

## 📄 License
This project is licensed under the MIT License.
