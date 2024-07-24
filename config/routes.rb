Rails.application.routes.draw do
  resources :coaches, only: [:index, :show, :create]
  resources :students, only: [:index, :show, :create]
  resources :slots, only: [:index, :show, :create, :update, :destroy]
  resources :bookings, only: [:index, :show, :create, :update, :destroy]
end
