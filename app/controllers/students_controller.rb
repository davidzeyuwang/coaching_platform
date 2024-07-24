class StudentsController < ApplicationController
  def index
    @students = User.where(role: 'student').page(params[:page]).per(params[:per_page] || 10)
    render json: {
      students: @students,
      meta: pagination_meta(@students)
    }
  end

  def show
    @student = User.find(params[:id])
    render json: @student
  end

  def create
    @student = User.new(student_params)
    @student.role = 'student' # Ensure the role is set to student
    if @student.save
      render json: @student, status: :created
    else
      render json: @student.errors, status: :unprocessable_entity
    end
  end

  def student_params
    params.require(:student).permit(:name, :phone_number, :role)
  end

  private

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
