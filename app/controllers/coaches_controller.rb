class CoachesController < ApplicationController
  def index
    if params[:coach_id]
      @coaches = User.where(role: 'coach').where(id: params[:coach_id]).page(params[:page]).per(params[:per_page] || 10)
    else
      @coaches = User.where(role: 'coach').page(params[:page]).per(params[:per_page] || 10)
    end

    render json: {
      coaches: @coaches,
      meta: pagination_meta(@coaches)
    }
  end

  def show
    @coach = User.find(params[:id])
    render json: @coach
  end

  def create
    @coach = User.new(coach_params)
    @coach.role = 'coach'
    if @coach.save
      render json: @coach, status: :created
    else
      render json: @coach.errors, status: :unprocessable_entity
    end
  end

  private

  def coach_params
    params.require(:coach).permit(:name, :phone_number, :coach_id)
  end

  def pagination_meta(object)
    {
      total_pages: object.total_pages,
      current_page: object.current_page,
      next_page: object.next_page,
      prev_page: object.prev_page,
      total_count: object.total_count,
      per_page: object.limit_value
    }
  end
end
