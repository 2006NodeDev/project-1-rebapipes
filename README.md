# Roadey - Gig Booking & Tour Management
Roadey puts gig booking and tour management at the tip of your fingers. Whether solo or part of a band, be confident in the direction of your career with our gig booking and tour management app. 

It's like having a booking manager and tour director all in one! Get ready to hit the road running with Roadey!

# Models

**User**  
The User model keeps track of users information.
```javascript
{
  userId: number, // primary key
	username: string, // not null, unique
	password: string, // not null
	firstName: string, // not null
	lastName: string, // not null
	email: string, // not null
	role: Role // not null
}
```

**Role**  
The Role model is used to track what permissions a user has.
```javascript
{
  roleId: number, // primary key
  role: string // not null, unique
}
```

**Booking**  
The Booking model is used to represent a single, booked gig.
```javascript
{
  bookingId: number, // primary key
	venue: string,  // foreign key -> User, not null
	payment: number,  // not null
  gigDate: number, // not null
  dateSubmitted: number, // not null
  dateResolved: number, // not null
  description: string, // not null
  status: number, // foreign ey -> BookingStatus, not null
  type: number // foreign key -> BookingType
}
```

**BookingStatus**  
The BookingStatus model is used to track the status of bookings. Status possibilities are `Pending`, `Postponed`, `Cancelled`, or `Booked`.
```javascript
{
  statusId: number, // primary key
  status: string // not null, unique
}
```

**BookingType**  
The BookingType model is used to track what kind of booking is being submitted. Type possibilities are `Opening`, `Supporting`, or `Headlining`.
```javascript
{
  typeId: number, // primary key
  type: string, // not null, unique
}
```

# Endpoints

## Security
  Security should be handled through session storage.
  If a user does not have permission to access a particular endpoint it should return the following:
  * **Status Code:** 401 UNAUTHORIZED <br />
    **Content:** 
    ```javascript
    {
      "message": "The incoming token has expired"
    }
    ```
    Occurs if they do not have the appropriate permissions.

## Available Endpoints
  Retreives users from the database

### **Login**  
* **URL**
  `/login`

* **Method:**
  `POST`

* **Request:**
  ```javascript
  {
    username: string,
    password: string
  }
  ```

* **Response:**
    ```javascript
      User
    ```

* **Error Response**
  * **Status Code:** 400 BAD REQUEST
  ```javascript
  {
    message: "Invalid Credentials"
  }
  ```
### **Find Users**
* **URL**
  `/users`

* **Method:**
  `GET`

* **Allowed Roles** `admin`

* **Response:**
    ```javascript
    [
      User
    ]
    ```

### **Find Users By Id**  
* **URL**
  `/users/:id`

* **Method:**
  `GET`

* **Allowed Roles** `admin, user` or if the id provided matches the id of the current user

* **Response:**
    ```javascript
    [
      User
    ]
    ```

### **Update User**  
* **URL**
  `/users`

* **Method:**
  `PATCH`

* **Allowed Roles** `admin, user`

* **Request**
  The userId must be present as well as all fields to update, any field left undefined will not be updated.
  ```javascript
    User
  ```

* **Response:**
    ```javascript
      User
    ```

### **Find Bookings By Status**  
Bookings should be ordered by date
* **URL**
  `/bookings/status/:statusId`  
  For a challenge you could do this instead:  
  `/bookings/status/:statudId/date-submitted?start=:startDate&end=:endDate`

* **Method:**
  `GET`

* **Allowed Roles** `admin, user`

* **Response:**
    ```javascript
    [
      Booking
    ]
    ```

### **Find Bookings By User**  
Bookings should be ordered by date.
* **URL**
  `/bookings/author/userId/:userId`  
  For a challenge you could do this instead:  
  `/bookings/author/userId/:userId/date-submitted?start=:startDate&end=:endDate`

* **Method:**
  `GET`

* **Allowed Roles** `admin, user` or if ther userId is the user making the request.

* **Response:**
    ```javascript
    [
      Booking
    ]
    ```

### **Submit Booking**  
* **URL**
  `/bookings`

* **Method:**
  `POST`

* **Rquest:**
  The bookingId should be 0
  ```javascript
    Booking
  ```

* **Response:**
  * **Status Code** 201 CREATED
    ```javascript
      Booking
    ```


### **Update Booking**  
* **URL**
  `/bookings`

* **Method:**
  `PATCH`

* **Allowed Roles** `admin, user`

* **Request**
  The bookingId must be present as well as all fields to update, any field left undefined will not be updated. 
  ```javascript
    Booking
  ```

* **Response:**
    ```javascript
      Booking
    ```

# Architecture Requirements
  * Website must be deployed in a Cloud Storage bucket acting as a web server
  * Server will be built with express and deployed on Google Compute Engine
  * Server should be in a managed instance group with elastic scaling based on user demand
  * Access to the server will be through Cloud Load balancing, with either http or https
  * Express server should connect to Cloud Pub Sub to send asynchronous messages to relevant services
  * Cloud Function should be used for extraneous operations
  
# Content Requirements
  * Website should allow a user to access the functionality of the server
  * Server should send important update through Cloud Pub Sub for other services
  * Should have at least one Cloud Function that does something interesting
  * Must support users having at least one image related to them (profile picture), with images stored in    Cloud Storage
  
# Functionality Requirements (Users)
  * Users can create new accounts with the website [POST]
  * Users can login through the website [POST]
  * Users can see and update/edit their profile information [PATCH]
  * Users can see and update/edit their profile picture [PATCH]
  * Something (feature/functionality) of my choosing
  
# Technology Requirements
  * Compute Engine
  * Cloud Load Balancing
  * Cloud Storage (AWS or GCP)
  * Persistent Disk
  * VPC (Virtual Private Cloud - Amazon or Google)
  * Cloud Pub Sub
  * Cloud Function (GCP)
  * Cloud SQL
  * Express Server
  * React JS
  * PostgreSQL Database
  * Pg (Postgres) or Knex for Queries
  * Redux is optional
