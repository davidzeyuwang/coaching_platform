class Booking < ApplicationRecord
    belongs_to :slot
    belongs_to :student, class_name: 'User', foreign_key: 'student_id'

    validates :satisfaction, inclusion: { in: 1..5, allow_nil: true }
    validates :notes, length: { maximum: 1000, allow_nil: true }
    validate :no_time_overlap

    def no_time_overlap
      existing_bookings = Booking.joins(:slot).where(student_id: student_id).where.not(id: id)
      if existing_bookings.any? { |booking| (slot.start_time...slot.end_time).overlaps?(booking.slot.start_time...booking.slot.end_time) }
        errors.add(:base, 'Booking time overlaps with existing booking')
      end
    end
  end
