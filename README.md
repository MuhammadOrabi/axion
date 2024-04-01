The Challenge: (School Management API) the following challenge must use the following repo as its boilerplate https://lnkd.in/d59uSwqS. do not change the structure of the boilerplate, understand it and follow its structure.

Your task is to create a school management application that allows users to perform basic CRUD operations on three main entities: School, Classroom, and Student. The application should provide APIs that enable the management of these entities. Superadmins will have the ability to add schools, while school admins can manage classrooms and students within their respective schools.


Guidelines and Considerations:
1. You can only use JS
2. Use a database (MongoDB/Redis) to store the school, classroom, and student data.
3. Ensure proper validation and error handling is implemented for the API endpoints.
4. You can design the database schema according to your preference but make sure to ingclude the necessary relationships between the entities.
5. Provide clear documentation for the API endpoints, including input and output formats.
6. Test the application thoroughly to ensure correctness and robustness.
7. Implement authentication and authorization mechanisms to ensure only authorized users can access specific endpoints.



## to run the app
- `cp .env.example .env`
- Using docker
  - `docker-compose up -d`
- Using node
  - `npm install`   
  - `node app.js`
  - Note: make sure that mongo and redis are up and running and make sure to set a valid `MONGO_URI` and `REDIS_URI` in the .env file
- then you will need to seed an admin using using admin api `http://[::]:5222/api/user/seed - GET request` with the value of `SUPER_ADMIN_INITIAL_PASSWORD` in the .env file


## API Documentation
https://documenter.getpostman.com/view/20473899/2sA35HWL7g


## Admin Credentials
`email: admin@mail.com`

`password: P@ssw0rd`