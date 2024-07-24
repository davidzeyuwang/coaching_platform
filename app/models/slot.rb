class Slot < ApplicationRecord
  belongs_to :coach, class_name: 'User', foreign_key: 'coach_id'
  has_one :booking
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :booked, inclusion: { in: [true, false] }
  validate :no_time_overlap
  validate :duration_is_two_hours, on: :create
  validate :start_time_in_future, on: :create
  before_save :set_default_booked

  def set_default_booked
    self.booked = false if booked.nil?
  end

  def no_time_overlap
    existing_slots = Slot.where(coach_id: coach_id).where.not(id: id)
    if existing_slots.any? { |slot| (start_time...end_time).overlaps?(slot.start_time...slot.end_time) }
      errors.add(:base, 'Slot time overlaps with existing slot')
    end
  end

  def student
    booking&.student
  end

  def duration_is_two_hours
    if (end_time - start_time) != 2.hours
      errors.add(:end_time, 'must be exactly 2 hours after start time')
    end
  end

  def start_time_in_future
    if start_time < Time.now
      errors.add(:start_time, 'must be in the future')
    end
  end
end
