(function (window) {
  window.__env = window.__env || {};

  
  // Domain name
  window.__env.domain = window.location.hostname;

  // setup application environment
  window.__env.app_environment = (window.__env.domain == 'jibbar.com' || window.__env.domain == 'www.jibbar.com') ? 'production' : 'staging';
}(this));