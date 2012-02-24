# encoding: utf-8
require 'rails'

module GwpAnlas

  class Engine < Rails::Engine

    engine_name "gwp_anlas"

    initializer :assets do |config|
      Rails.application.config.assets.precompile += %w( gwp_anlas/app.js gwp_anlas.js  gwp_anlas.css )
    end

  end # Engine

end	# GwpAnlas
