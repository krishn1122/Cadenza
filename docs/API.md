# 📚 Cadenza API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow this structure:
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10
  }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@gmail.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@gmail.com",
      "is_admin": false,
      "is_cadenza": false
    }
  }
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@gmail.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@gmail.com",
      "is_admin": false,
      "is_cadenza": false
    }
  }
}
```

### Google OAuth
```http
GET /auth/google
```
Redirects to Google OAuth consent screen.

### LinkedIn OAuth
```http
GET /auth/linkedin
```
Redirects to LinkedIn OAuth consent screen.

---

## 🏢 Company Endpoints

### Get All Companies
```http
GET /companies
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search query
- `category` (optional): Filter by category
- `location` (optional): Filter by location

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "TechCorp Inc",
      "logo_url": "https://example.com/logo.png",
      "category": "Technology",
      "location": "San Francisco, CA",
      "description": "Leading tech company...",
      "verified": true,
      "stage": "Series B",
      "website": "https://techcorp.com",
      "founded_year": 2018,
      "employee_count": "51-200",
      "funding_stage": "Series B",
      "total_funding": "$50M",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### Get Company by ID
```http
GET /companies/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "TechCorp Inc",
    "logo_url": "https://example.com/logo.png",
    "category": "Technology",
    "location": "San Francisco, CA",
    "description": "Leading tech company...",
    "verified": true,
    "stage": "Series B",
    "website": "https://techcorp.com",
    "founded_year": 2018,
    "employee_count": "51-200",
    "funding_stage": "Series B",
    "total_funding": "$50M",
    "investor_information": "Sequoia Capital, Andreessen Horowitz",
    "product_description": "AI-powered business solutions",
    "business_model": "SaaS",
    "target_market": "Enterprise",
    "competitive_landscape": "Competing with Salesforce, HubSpot",
    "traction_metrics": "10K+ users, $5M ARR",
    "tractionScore": 85,
    "notes": "High growth potential",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Search Companies
```http
GET /companies/search
```

**Query Parameters:**
- `q`: Search query (required)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### Create Company (Admin Only)
```http
POST /companies
```
**Requires:** Admin authentication

**Request Body:**
```json
{
  "name": "NewTech Inc",
  "category": "Technology",
  "location": "New York, NY",
  "description": "Innovative tech startup...",
  "website": "https://newtech.com",
  "founded_year": 2023,
  "employee_count": "1-10",
  "funding_stage": "Seed"
}
```

### Update Company (Admin Only)
```http
PUT /companies/:id
```
**Requires:** Admin authentication

### Delete Company (Admin Only)
```http
DELETE /companies/:id
```
**Requires:** Admin authentication

---

## 👥 People Endpoints (Admin Only)

All people endpoints require admin authentication.

### Get All People
```http
GET /people
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search query
- `category` (optional): Filter by category
- `location` (optional): Filter by location

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Jane Smith",
      "avatar_url": "https://example.com/avatar.png",
      "category": "Executive",
      "location": "San Francisco, CA",
      "description": "Experienced CEO with 15+ years...",
      "verified": true,
      "company": "TechCorp Inc",
      "position": "CEO",
      "email": "jane@techcorp.com",
      "linkedin": "https://linkedin.com/in/janesmith",
      "twitter": "@janesmith",
      "education": "MBA from Stanford",
      "experience": "15+ years in tech leadership",
      "skills": "Leadership, Strategy, Product Development",
      "achievements": "Built 3 successful startups",
      "notes": "Key industry influencer",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 10
  }
}
```

### Get Person by ID
```http
GET /people/:id
```

### Search People
```http
GET /people/search
```

### Create Person
```http
POST /people
```

**Request Body:**
```json
{
  "name": "John Developer",
  "category": "Engineer",
  "location": "Austin, TX",
  "description": "Senior full-stack developer...",
  "company": "TechCorp Inc",
  "position": "Senior Developer",
  "email": "john@techcorp.com",
  "linkedin": "https://linkedin.com/in/johndeveloper",
  "skills": "React, Node.js, PostgreSQL"
}
```

### Update Person
```http
PUT /people/:id
```

### Delete Person
```http
DELETE /people/:id
```

---

## 📝 Blog Endpoints

### Get All Published Blogs
```http
GET /blogs
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "The Future of AI in Business",
      "content": "Full blog content here...",
      "summary": "Brief summary of the blog post",
      "image_url": "https://example.com/blog-image.jpg",
      "category": "Technology",
      "tags": "AI, Business, Innovation",
      "published": true,
      "publish_date": "2024-01-15T10:00:00.000Z",
      "pinned": false,
      "author": {
        "id": 1,
        "full_name": "Admin User",
        "email": "admin@gmail.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 15,
    "itemsPerPage": 10
  }
}
```

### Get Blog by ID
```http
GET /blogs/:id
```

### Create Blog (Admin Only)
```http
POST /blogs
```
**Requires:** Admin authentication

**Request Body:**
```json
{
  "title": "New Blog Post",
  "content": "Full content of the blog post...",
  "summary": "Brief summary",
  "image_url": "https://example.com/image.jpg",
  "category": "Technology",
  "tags": "AI, Innovation",
  "published": true,
  "pinned": false
}
```

### Update Blog (Admin Only)
```http
PUT /blogs/:id
```
**Requires:** Admin authentication

### Delete Blog (Admin Only)
```http
DELETE /blogs/:id
```
**Requires:** Admin authentication

---

## 👤 User Endpoints

### Get Current User
```http
GET /users/me
```
**Requires:** Authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@gmail.com",
    "is_admin": false,
    "is_cadenza": false,
    "profile_picture": "https://example.com/avatar.jpg",
    "auth_provider": "local",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update User Profile
```http
PUT /users/me
```
**Requires:** Authentication

**Request Body:**
```json
{
  "full_name": "John Updated Doe",
  "profile_picture": "https://example.com/new-avatar.jpg"
}
```

### Get All Users (Admin Only)
```http
GET /users
```
**Requires:** Admin authentication

---

## 🖼️ Image Endpoints

### Get Image
```http
GET /images/:filename
```

Serves static images from the uploads directory.

---

## ❌ Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 500 | Internal Server Error |

## 🔍 Common Error Responses

### Validation Error
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

### Authentication Error
```json
{
  "success": false,
  "error": "Authentication required",
  "details": "Please provide a valid token"
}
```

### Authorization Error
```json
{
  "success": false,
  "error": "Access denied",
  "details": "Admin privileges required"
}
```

### Not Found Error
```json
{
  "success": false,
  "error": "Resource not found",
  "details": "Company with ID 999 not found"
}
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Email addresses must be Gmail addresses (@gmail.com)
- File uploads are handled via multipart/form-data
- Search queries support partial matching and are case-insensitive
- Pagination starts from page 1
- Maximum items per page is 100
