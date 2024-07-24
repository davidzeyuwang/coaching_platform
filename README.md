# Coaching Conundrum

Welcome to the **Coaching Conundrum** project, a comprehensive solution designed to manage 1-on-1 coaching calls between students and coaches. This project ensures seamless scheduling and management of coaching sessions, enabling efficient communication and feedback between coaches and students.


https://github.com/user-attachments/assets/a7a036d7-0f76-46a7-8ca9-ed3c469a5422


## User Stories

The **Coaching Conundrum** project is designed to satisfy the following user stories:

1. **Coaches** can add slots of availability to their calendars. These slots are always 2 hours long and each slot can be booked by exactly one student.
2. **Coaches** can view their own upcoming slots.
3. **Students** can book upcoming, available slots for any coach.
4. When a slot is booked, both the student and coach can view each other’s phone number.
5. After completing a call with a student, **coaches** will record the student’s satisfaction (an integer 1-5) and write some free-form notes.
6. **Coaches** should be able to review their past scores and notes for all of their calls.

## Technologies

This project utilizes the following technologies:

- **Frontend framework:** React/TypeScript
- **Backend:** Ruby on Rails
- **Database:** MySQL, etc.


## Prerequisites

Ensure you have the following installed:

- Ruby
- Rails
- Node.js
- npm
- mysql

## Installation

### Dependencies
```shell
brew install openssl@1.1
```

Add the following to `~/.zshrc`:

```shell
export PATH="/usr/local/opt/openssl@1.1/bin:$PATH"
export LDFLAGS="-L/usr/local/opt/openssl@1.1/lib"
export CPPFLAGS="-I/usr/local/opt/openssl@1.1/include"
export PKG_CONFIG_PATH="/usr/local/opt/openssl@1.1/lib/pkgconfig"
```

### Ruby

Install rbenv and Ruby:

```shell
# Install rbenv
curl -fsSL https://github.com/rbenv/rbenv-installer/raw/main/bin/rbenv-installer | bash
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(rbenv init -)"' >> ~/.zshrc
source ~/.zshrc

# Install ruby-build as an rbenv plugin
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build

# Install Ruby
rbenv install 3.0.2
rbenv global 3.0.2

# Verify the Ruby version
ruby -v
```


### MySQL


Install MySQL and mysql-client:

```shell
brew install mysql
brew install mysql-client
gem install mysql2 -v '0.5.6' -- --with-mysql-config=/usr/local/opt/mysql-client/bin/mysql_config

# Add to ~/.zshrc
export PATH="/usr/local/opt/mysql-client/bin:$PATH"
```

### React

Install npm dependencies:

```shell
npm install
```

## Database Setup

### MySQL Commands

Start, stop, and restart MySQL services:

```shell
brew services start mysql
brew services stop mysql
brew services restart mysql
```

Login to MySQL:

```shell
mysql -u root -p 
```

### Creating the Database and Generating Models

Ensure MySQL is running, then proceed with the following steps to create the database and generate the necessary models:

```sh
rails db:create

rails generate model User name:string phone_number:string role:integer
rails generate model Slot coach_id:integer start_time:datetime end_time:datetime booked:boolean
rails generate model Booking slot_id:integer student_id:integer satisfaction:integer notes:text
```

Run database migrations:

```sh
rails db:migrate
```

### Database Initialization

Initialize the database with seed data:

```sh
DISABLE_SPRING=1 rails db:seed
# or
spring stop
rails db:seed
```

## Running the Application

### Running the Server

Start the Rails server:

```sh
bundle install
rails server
```

Start the frontend:

```sh
cd frontend
npm start
```

### Verifying the Application

Verify the application by visiting the following endpoints:

- Coaches: [http://localhost:3000/coaches](http://localhost:3000/coaches)
- Students: [http://localhost:3000/students](http://localhost:3000/students)
- Slots: [http://localhost:3000/slots](http://localhost:3000/slots)
- Bookings: [http://localhost:3000/bookings](http://localhost:3000/bookings)
- http://localhost:3000/slots?coach_id=X
- http://localhost:3000/bookings?student_id=X

Example CURL commands:

Create a coach:

```sh
curl -X POST http://localhost:3000/coaches \
     -H "Content-Type: application/json" \
     -d '{
           "coach": {
             "name": "Coach One",
             "phone_number": "123-456-7890"
           }
         }'
```

Create a student:

```sh
curl -X POST http://localhost:3000/students \
     -H "Content-Type: application/json" \
     -d '{
           "student": {
             "name": "Student One",
             "phone_number": "123-432-3412"
           }
         }'
```

Create slots:

```sh
curl -X POST http://localhost:3000/slots \
     -H "Content-Type: application/json" \
     -d '{
           "slot": {
             "coach_id": 1,
             "start_time": "2024-07-09T10:00:00",
             "end_time": "2024-07-09T12:00:00",
             "booked": false
           }
         }'
```

## Testing

To run the test suite, execute:

```sh
bundle install
rails server
```


## Deployment

Provide instructions for deploying the application.

## TODO

- [x] Add create student and coach
- [x] Fix create slot
- [x] Fix delete slot
- [x] Add pagination
- [x] Fix filtering
- [x] slots are always two hours long
- [x] when a slot is booked both coach and student can see each other's phone number
- [x] coach can add notes and satifcation after a booked slots is over
- [x] coach should be able to view his past booked slots, notes, and students satisfactions scores
- [x] coach can view/delete/update upcoming slots
- [x] student can view/delete/update upcoming slots
- [ ] create new endpoint for get comming bookings, slots not booked, and the past bookings
- [ ] support pagination for each of the new endpoint and on the UI
- [x] Create new UI page for past bookings, and UI module to view booking details
- [ ] Improving query performance by adding index on coachId+booking on slots table for coach, and studentId on booking table for student UI. 
- [ ] Making sure the consistent naming. (In listview, it shows the coach name. When booking, it shows coach id).
