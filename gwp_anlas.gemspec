# -*- encoding: utf-8 -*-
Gem::Specification.new do |s|
  
  s.name = 'gwp_anlas'
  s.version = '1.0'
  s.platform = Gem::Platform::RUBY
  s.authors = ['Tyralion']
  s.email = ['piliaiev@gmail.ru']
  s.homepage = 'https://github.com/dancingbytes/gwp-anlas'
  s.summary = 'Workplace for Gektor-based administration system'
  s.description = 'Workplace for Gektor-based administration system'

  s.files = `git ls-files`.split("\n")
  s.extra_rdoc_files = ['LICENSE.BSD', 'README.md']
  s.require_paths = ['lib']

  s.licenses = ['BSD']

  s.add_dependency 'railties', ['>= 3.0.0']
  s.add_dependency 'sprockets', '>= 2.0.0'

end