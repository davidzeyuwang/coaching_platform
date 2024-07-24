User.destroy_all
Slot.destroy_all
Booking.destroy_all

# Create sample coaches
coach1 = User.create!(name: 'Coach One', phone_number: '123-456-7890', role: :coach)
coach2 = User.create!(name: 'Coach Two', phone_number: '098-765-4321', role: :coach)

# Create sample students
student1 = User.create!(name: 'Student One', phone_number: '111-222-3333', role: :student)
student2 = User.create!(name: 'Student Two', phone_number: '444-555-6666', role: :student)

# Create sample slots
Slot.create!(coach: coach1, start_time: '2024-07-09 10:00:00', end_time: '2024-07-09 12:00:00', booked: false)
Slot.create!(coach: coach1, start_time: '2024-07-10 14:00:00', end_time: '2024-07-10 16:00:00', booked: true)
Slot.create!(coach: coach2, start_time: '2024-07-11 10:00:00', end_time: '2024-07-11 12:00:00', booked: false)

# Create sample bookings
Booking.create!(slot: Slot.second, student: student1, satisfaction: 5, notes: 'Great session!')
