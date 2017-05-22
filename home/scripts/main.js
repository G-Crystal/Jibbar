(function () {
  'use strict';

  var $htmlBody = $('html, body'),
    $formItems = $('.c-home__forms-item > *'),
    $closeFormButton = $('#close-form-button'),
    $preRegistrationOpenButton = $('#pre-registration-button'),
    $preRegistrationForm = $('#pre-registration'),
    $preRegistrationThanks = $('#pre-registration-thanks'),
    $signinForm = $('#signin'),
    $signupForm = $('#signup'),
    $topSection = $('.c-home__top'),
    $pricingSection = $('.c-home__pricing'),
    $topSectionArrow = $('#top-arrow'),
    $pricingLink = $('#pricing-link'),
    $signupLinks = $('.signup-link'),
    $signinLink = $('#signin-link'),
    slideAnimationDuration = 500,
    scrollAnimationDuration = 600;

  var addClickListenerToPreRegistrationOpenButton = function () {
    $preRegistrationOpenButton.click(function () {
      if($preRegistrationForm.is(':visible')) return;

      $preRegistrationForm.slideDown(slideAnimationDuration);
    });
  };

  var addClickListenerToCloseFormButton = function () {
    $closeFormButton.click(function () {
      $formItems.slideUp(slideAnimationDuration);
    });
  };

  var addClickListenerToTopArrow = function () {
    $topSectionArrow.click(function () {
      $htmlBody.animate({
        scrollTop: $topSection.offset().top + $topSection.outerHeight()
      }, scrollAnimationDuration);
    });
  };

  var addClickListenerToPricingLink = function () {
    $pricingLink.click(function () {
      $htmlBody.animate({
        scrollTop: $pricingSection.offset().top
      }, scrollAnimationDuration);
    });
  };

  var addClickListenerToSignupLink = function () {
    $signupLinks.click(function () {
      if($signupForm.is(':visible')) return;

      $formItems.slideUp(slideAnimationDuration);
      $signupForm.slideDown(slideAnimationDuration);
    });
  };

  var addClickListenerToSigninLink = function () {
    $signinLink.click(function () {
      if($signinForm.is(':visible')) return;

      $formItems.slideUp(slideAnimationDuration);
      $signinForm.slideDown(slideAnimationDuration);
    });
  };

  var addSubmitListenerToPreRegistrationFormForm = function () {
    $preRegistrationForm.find('form').submit(function () {
      $preRegistrationForm.find('> *').hide();
      $preRegistrationThanks.fadeIn(700);

      setTimeout(function () {
        $preRegistrationForm.find('> *').fadeIn(700);
        $preRegistrationThanks.hide();
      }, 10000);

      return false;
    });
  };

  addClickListenerToPreRegistrationOpenButton();
  addClickListenerToCloseFormButton();
  addClickListenerToTopArrow();
  addClickListenerToPricingLink();
  addClickListenerToSignupLink();
  addClickListenerToSigninLink();
  addSubmitListenerToPreRegistrationFormForm();

})();
