(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/home/home.html',
    controller: HomeController,
    bindings: {}
  };

  angular
    .module('jibbar.home')
    .component('jibbarHome', componentConfig);

  HomeController.$inject = ['$element', '$templateRequest', '$state', 'appSettings'];

  function HomeController($element, $templateRequest, $state, appSettings) {
    var vm = this;

    vm.$onInit = $onInit;
    vm.$postLink = $postLink;
    vm.getTemplateTypes = getTemplateTypes;
    vm.getWhoList = getWhoList;
    vm.getPricingTable = getPricingTable;
    vm.scrollBelowHeader = scrollBelowHeader;
    vm.scrollToPricing = scrollToPricing;
    vm.isString = isString;
    vm.navigateToSignUp = navigateToSignUp;

    ///////

    var windowElement = angular.element(window);
    var topElement = angular.element($element).find('.c-home__top');
    var pricingElement = angular.element($element).find('.c-home__pricing');

    var templateTypes = [
      ['marketing', 'Promotions & Marketing'],
      ['everyday', 'Everyday Messages'],
      ['business', 'Business Development'],
      ['social', 'Social Media'],
      ['events', 'Events & Announcements'],
      ['newsletter', 'Newsletters']
    ];
    var whoList = [
      ['target', 'Sales & Marketing Teams', 'Get better results using world-class email templates incorporating analytics'],
      ['group', 'Professional Services', 'Build client confidence and retention  using professionally designed email templates'],
      ['store', 'Small Business Owners', 'Communicate as a professional to be trusted using our business and marketing email templates'],
      ['family', 'Healthcare & Education', 'Keep everyone informed and promote your Facebook and YouTube activity'],
      ['bag', 'Entertainment & Retail', 'Quickly and easily email your special offers and promotions to your existing customers '],
      ['network', 'Associations & NGOs', 'Impress stakeholders with sophisticated emails created and sent by you in seconds ']
    ];
    var pricingTable = [
      ['FREE', '$7.95', '$9.95', '$12.95', '$24.95'],
      ['Three FREE broadcasts', 'Per broadcast', 'Three broadcasts<br> per month', 'Ten broadcasts<br> per month', '100 broadcasts<br> per month'],
      ['No credit card required', 'Pay only when you broadcast', 'Pause or cancel anytime<br>No questions asked', 'Pause or cancel anytime<br>No questions asked', 'Pause or cancel anytime<br>No questions asked'],
      ['1000 free email credits', 'Cost per email address<br>from 1 cent', 'Cost per email address<br>from 1 cent', 'Cost per email address<br>from 1 cent', 'Cost per email address<br>from 1 cent']
    ];

    function $onInit() {
      preloadFormTemplates();
    }

    function $postLink() {
      setTopHeightToScreenHeightAndWatchForResize();
    }

    function getTemplateTypes() {
      return templateTypes;
    }

    function getWhoList() {
      return whoList;
    }

    function getPricingTable() {
      return pricingTable;
    }

    function scrollBelowHeader() {
      angular.element('html, body').animate({
        scrollTop: topElement.offset().top + topElement.outerHeight()
      }, 600);
    }

    function scrollToPricing() {
      angular.element('html, body').animate({
        scrollTop: pricingElement.offset().top
      }, 600);
    }

    function isString(value) {
      return angular.isString(value);
    }

    function preloadFormTemplates() {
      $templateRequest('components/home/sign-in/sign-in.html');
      $templateRequest('components/home/sign-up/sign-up.html');
      $templateRequest('components/home/pre-registration/pre-registration.html');
    }

    function setTopHeightToScreenHeightAndWatchForResize() {
      var width = windowElement.width();
      var setHeight = function () {
        topElement.height(windowElement.height());
      };

      angular.element(window).on('resize', function () {
        // change height only on width change to prevent content jump on mobile chrome scroll
        if (width != windowElement.width()) {
          setHeight();
          width = windowElement.width();
        }
      });

      setHeight();
    }

    function navigateToSignUp() {
      if(appSettings.isInPreRegMode){
        $state.go('home.pre-registration');
      } else{
        $state.go('home.sign-up');
      }
    }
  }
})();