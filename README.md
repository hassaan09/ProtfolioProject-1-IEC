
# Protfolio-Project
This repo contains all the deliverables of my first Portfolio-Project at IEC. This is a User-Authentication System Build using Node.js, Express.js and MongoDB Database.

**Overview:**
The system/app is designed to register new users into the system and afterwards, through a login mechanism those users are granted access to the protected resources of the system.


**Tools:** : Node.js ◆, Express.js🌐 , MongoDB 🛢️

**Models/Tables**: Users, Cars(Protected Resource)

**Functionality:** .User Registeration with unique username and password

  **APIs:**
	(/)  HomePage
	(/register) For Registration/SignUp
	(/login) For Loggin in
	(/verify) For Testing Authentication
	(/protectedresources) For Accessing Protected Resources as an authenticated user
	(/carname=name) For Accessing Car’s Collection in the database by name
	(/addCar) For Adding Cars into the Car’s Collection at the database
	(/deleteCar) For Deletion of one object in the Car by name
	(/logout) For Loggin Out of the application


**Functionality:**
User Register/Sign-up:
•	New users can Sign-up 
•	The username must be unique
•	Password must not be less than 6 characters
•	Password hashing is performed to protect the user
**Log-In:**
•	The user gets to log
•	Upon Successful Login, a JWT will be issued which will have a validity of 5 minutes as the database is very small and just has one collection to explore.
**Log-Out:**
•	The log-out functionality is performed by appending the authorization token in the header, to a global array. If it is already an expired token,  then the user will get an error. Else will be logged.
APIs Protection:
•	The API endpoints are protected using a middleware, which authenticates the user for each HTTP request and verifies the token. In this way, only the authorized users have access to the resources.
