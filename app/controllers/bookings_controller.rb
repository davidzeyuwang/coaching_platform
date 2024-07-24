class BookingsController < ApplicationController
  def index
    if params[:student_id]
      @bookings = Booking.where(student_id: params[:student_id]).page(params[:page]).per(params[:per_page] || 10)
    else
      @bookings = Booking.page(params[:page]).per(params[:per_page] || 10)
    end

    render json: {
      bookings: @bookings,
      meta: pagination_meta(@bookings)
    }
  end

  def show
    @booking = Booking.find(params[:id])
    render json: @booking
  end

  def create
    @booking = Booking.new(booking_params)
    if @booking.save
      render json: @booking, status: :created
    else
      render json: @booking.errors, status: :unprocessable_entity
    end
  end

  def update
    @booking = Booking.find(params[:id])
    if @booking.update(booking_params)
      render json: @booking
    else
      render json: @booking.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @booking = Booking.find(params[:id])
    @booking.destroy
    head :no_content
  end

  private

  def booking_params
    params.require(:booking).permit(:slot_id, :student_id, :satisfaction, :notes)
  end

  def pagination_meta(object)
    {
      total_pages: object.total_pages,
      current_page: object.current_page,
      next_page: object.next_page,
      prev_page: object.prev_page,
      total_count: object.total_count
    }
  end
end
