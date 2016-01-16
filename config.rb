configure :development do
  activate :livereload
  config[:file_watcher_ignore] += [/.idea\//]
end

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

configure :build do
  activate :minify_css
  activate :minify_javascript
end

activate :deploy do |deploy|
  deploy.method = :git
  # Optional Settings
  # deploy.remote   = 'custom-remote' # remote name or git url, default: origin
  deploy.branch   = 'master' # default: gh-pages
  # deploy.strategy = :submodule      # commit strategy: can be :force_push or :submodule, default: :force_push
  # deploy.commit_message = 'custom-message'      # commit message (can be empty), default: Automated commit at `timestamp` by middleman-deploy `version`
end

# Variables
@socials = { github: 'https://github.com/vladfaust', vkontakte: 'https://vk.com/vladfaust', telegram: 'https://telegram.me/vladfaust', instagram: 'https://instagram.com/vladfaust', google_play: 'https://play.google.com/store/apps/developer?id=VLADISLAV+FAUST', twitter: 'https://twitter.com/vladfaust', email: 'mailto:hello@vladfaust.com' }
set :socials, @socials
