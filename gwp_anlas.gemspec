# -*- encoding: utf-8 -*-
Gem::Specification.new do |s|
  
  s.name = 'gwp_anlas'
  s.version = '1.0'
  s.platform = Gem::Platform::RUBY
  s.authors = ['Tyralion']
  s.email = ['piliaiev@gmail.ru']
  s.homepage = 'https://github.com/dancingbytes/gwp_anlas'
  s.summary = 'Workplace "Anlas" for Gektor (gwp_anlas)'
  s.description = 'Workplace for Gektor-based administration system'

  s.files = `git ls-files`.split("\n")
  s.require_paths = ['lib']
  s.has_rdoc = false

  s.licenses = ['BSD']

  s.add_dependency 'railties', ['>= 3.0.0']
  s.add_dependency 'sprockets', '>= 2.0.0'

end