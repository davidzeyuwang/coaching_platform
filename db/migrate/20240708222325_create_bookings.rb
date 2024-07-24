class CreateBookings < ActiveRecord::Migration[6.1]
  def change
    create_table :bookings do |t|
      t.integer :slot_id
      t.integer :student_id
      t.integer :satisfaction
      t.text :notes

      t.timestamps
    end
  end
end
