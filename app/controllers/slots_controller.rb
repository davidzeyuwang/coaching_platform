class SlotsController < ApplicationController
    def index
      if params[:coach_id]
      @slots = Slot.where(coach_id: params[:coach_id]).page(params[:page]).per(params[:per_page] || 10)
    else
      @slots = Slot.page(params[:page]).per(params[:per_page] || 10)
    end

    if params[:booked].present?
      @slots = @slots.where(booked: params[:booked])
    end

      render json: {
        slots: @slots.as_json(include: { coach: { only: [:id, :name, :phone_number] }, booking: { include: { student: { only: [:id, :name, :phone_number] } } } }),
        meta: pagination_meta(@slots)
      }
    end

  def show
    @slot = Slot.find(params[:id])
    render json: @slot.as_json(include: { coach: { only: [:id, :name, :phone_number] }, booking: { include: { student: { only: [:id, :name, :phone_number] } } } })
  end

  def create
    @slot = Slot.new(slot_params)
    if @slot.save
      render json: @slot, status: :created
    else
      render json: @slot.errors, status: :unprocessable_entity
    end
  end

  def update
    @slot = Slot.find(params[:id])
    if @slot.update(slot_params)
      render json: @slot
    else
      render json: @slot.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @slot = Slot.find(params[:id])
    @slot.destroy
    head :no_content
  end

  private

  def slot_params
    params.require(:slot).permit(:coach_id, :start_time, :end_time, :booked)
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
