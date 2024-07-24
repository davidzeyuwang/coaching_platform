class User < ApplicationRecord
    enum role: { student: 0, coach: 1 }
  
    has_many :slots, foreign_key: :coach_id
    has_many :bookings, foreign_key: :student_id
  
    validates :phone_number, presence: true
    validates :role, presence: true
  end
  