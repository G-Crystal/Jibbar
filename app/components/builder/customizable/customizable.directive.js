(function () {
  'use strict';

  angular
    .module('jibbar.builder.customizable')
    .directive('customizable', customizableDirective);

  function customizableDirective() {
    var directive = {
      restrict: 'A',
      scope: {
        editable: '<',
        maxlength: '<',
        multiline: '<',
        clonable: '<',
        removable: '<',
        width: '<',
        height: '<',
        borderRadius: '<',
        imageNoUse: '<',
        linkOnly: '<',
        signature: '<',
        linkedin: '<',
        twitter: '<',
        facebook: '<',
        instagram: '<',
        sender: '<',
        removeParent: '<',
        setBack: '<',
        updateMaxlengthOf: '<',
        updateMaxlengthTo: '<',
        imageWidth: '<',
        imageHeight: '<',
        footerMsg: '<'
      },
      controller: CustomizableController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  CustomizableController.$inject = ['$scope', '$element', '$attrs', '$templateRequest', '$compile', 'jibbarBuilder', 'jibbarPopup', '$rootScope', '$timeout', 'emailService','signatureService'];

  function CustomizableController($scope, $element, $attrs, $templateRequest, $compile, jibbarBuilder, jibbarPopup, $rootScope, $timeout, emailService,signatureService) {
    var vm = this;

    vm.$onInit = $onInit;
    vm.value = null;
    vm.hoverElementType = null;
    vm.hoverElementTypes = {
      IMAGE: 1,
      BORDERED: 2
    };
    vm.isLink = false;
    vm.isEditing = false;
    vm.setHoverElementPosition = setHoverElementPosition;
    vm.openImagesPopup = openImagesPopup;
    vm.openPopup = openPopup;
    vm.edit = edit;
    vm.remove = remove;
    vm.clone = clone;
    vm.triggerUpdateEmailBodyEvent = triggerUpdateEmailBodyEvent;
    vm.isImage = isImage;
    vm.fieldKeyPress = fieldKeyPress;
    vm.getLengthLeft = getLengthLeft;
    ///////

    var imageElement;
    var hoverElement;
    var hoverImageElement;

    function $onInit() {

      
      setDefinedBooleanAttrsToTrue();
      setImageElement();
      determineElementType();

      generateHoverElement();
      handleSignature();
      handleSocials();
      getValueFromDOM();

      subscribeForUpdatedEvent();
      
      handleImageNoUse();
      
      
      jibbarBuilder.addCustomizableDirective(vm);
    }

    function subscribeForUpdatedEvent() {

      $scope.$on('anchor-update', function (event, arg) {
        if (arg.element == $element) {
          $element.attr('href', arg.link);
          if (!vm.linkOnly) $element.text(arg.text);
          triggerUpdateEmailBodyEvent();
        }
      });

      $scope.$on('image-update', function (event, arg) {
        if (arg.element == imageElement) {
          imageElement.attr('src', arg.link).css('background-color', '');
          triggerUpdateEmailBodyEvent();
        }
      });
      $scope.$on('maxlength-update', function (event, arg) {
        
        if (arg.id == $element.attr('id')) {
          if(arg.maxlength == 0){
            $element.removeAttr('maxlength');
            vm.limited = false;
            vm.maxlength = null;
          }
          else{
            $element.attr('maxlength', arg.maxlength);
            vm.maxlength = arg.maxlength;
          }
          
          triggerUpdateEmailBodyEvent();
          generateHoverElement();
         
        }
      });
    }

    function setImageElement() {
      if ($element.is('a')) return;

      if ($element.is('img')) {
        imageElement = $element;
      }
      else if ($element.find('img').length && !vm.setBack) {
        imageElement = $element.find('img').first();
      }
    }

    function handleImageNoUse() {

      if (vm.imageNoUse) {

        imageElement.attr('src', '').css({'background-color':'#00aa92','width':$attrs['width'],'height':  $attrs['height']}).removeAttr('image-no-use');
      }
    }

    function handleSignature(){
      if(vm.signature) {
       
         $element.css({'white-space':'pre'});
         if(signatureService.isDefaultSignatureLoaded()){
            var sign = signatureService.getMyDefaultSignatureFromLocalStorage();
            var signature = sign.name+"\r\n"+sign.jobTitle+"\r\n"+sign.companyName;
            
            $element.text(signature);
            triggerUpdateEmailBodyEvent();
         }
         else{
            signatureService.getMyDefaultSignature().then(function(data){
            var sign = data.result;
            var signature = sign.name+"\r\n"+sign.jobTitle+"\r\n"+sign.companyName;
            
            $element.text(signature);
            triggerUpdateEmailBodyEvent();
           },
           function(error){
            console.log(error);
           });
         }
         
          
       }
    }

    function handleSocials(){
        if(vm.linkedin || vm.twitter || vm.facebook || vm.instagram || vm.sender ||vm.footerMsg) {
        
          if(signatureService.isDefaultSignatureLoaded()){
            var sign = signatureService.getMyDefaultSignatureFromLocalStorage();
            //console.log(sign);
            if(vm.linkedin)
              $element.attr('href',sign.linkedinUrl);
            else if(vm.twitter)
              $element.attr('href',sign.twitterUrl);
            else if(vm.facebook)
              $element.attr('href',sign.facebookUrl);
            else if(vm.instagram)
              $element.attr('href',sign.instagramUrl);
            else if(vm.sender)
              $element.text(sign.name);
            else if(vm.footerMsg){

              var disclaimer = $element.text().replace('__SENDER__', sign.name);
              disclaimer = disclaimer.replace("__HERE__", "at https://www.jibbar.com");
              $element.text(disclaimer);
             

            }
            else{
               // do nothing
            }
            //$element.text(signature);
            triggerUpdateEmailBodyEvent();
           }
          else{
            signatureService.getMyDefaultSignature().then(function(data){
            var sign = data.result;
            if(vm.linkedin)
              $element.attr('href',sign.linkedinUrl);
            else if(vm.twitter)
              $element.attr('href',sign.twitterUrl);
            else if(vm.facebook)
              $element.attr('href',sign.facebookUrl);
            else if(vm.instagram)
              $element.attr('href',sign.instagramUrl);
            else if(vm.sender)
              $element.text(sign.name);
            else if(vm.footerMsg){

              var disclaimer = $element.text().replace('__SENDER__', sign.name);
              disclaimer = disclaimer.replace("__HERE__", "at https://www.jibbar.com");
              $element.text(disclaimer);
             

            }
            else{
               // do nothing
            }
            triggerUpdateEmailBodyEvent();
           },
           function(error){
            console.log(error);
           });
           }
         
          
       }
    }
    

    function setDefinedBooleanAttrsToTrue() {
      vm.editable = angular.isDefined($attrs['editable']);
      vm.clonable = angular.isDefined($attrs['clonable']);
      vm.multiline = angular.isDefined($attrs['multiline']);
      vm.removable = angular.isDefined($attrs['removable']);
      vm.removeParent = angular.isDefined($attrs['removeParent']);
      vm.limited = angular.isDefined($attrs['maxlength']);
      vm.imageNoUse = angular.isDefined($attrs['imageNoUse']);
      vm.linkOnly = angular.isDefined($attrs['linkOnly']);
      vm.signature = angular.isDefined($attrs['signature']);
      vm.linkedin = angular.isDefined($attrs['linkedin']);
      vm.twitter = angular.isDefined($attrs['twitter']);
      vm.facebook = angular.isDefined($attrs['facebook']);
      vm.instagram = angular.isDefined($attrs['instagram']);
      vm.sender = angular.isDefined($attrs['sender']);
      vm.setBack = angular.isDefined($attrs['setBack']);
      vm.footerMsg = angular.isDefined($attrs['footerMsg']);
    }

    function determineElementType() {
      if (imageElement) {
        vm.hoverElementType = vm.hoverElementTypes.IMAGE;
      } else {
        vm.hoverElementType = vm.hoverElementTypes.BORDERED;
      }

      if ($element.is('a')) {
        vm.isLink = true;
      }
    }

    function generateHoverElement() {
      $templateRequest('components/builder/customizable/customizable.html').then(function (customizable) {

        hoverElement = $compile(customizable)($scope).hide();
        jibbarBuilder.getIframeHoversContainerElement().append(hoverElement);

        $timeout(function () {
          if (vm.hoverElementType == vm.hoverElementTypes.IMAGE) {
            hoverImageElement = hoverElement.find('.c-hover__image');
          }

          setHoverElementPosition();
          addOnMouseEnterAndLeaveEvent();
          updateHoverElementPositionOnMainResize();
          setEditableElementStyle();
         
          
        });


      });
    }

    function getValueFromDOM() {
      vm.value = $element.text().trim().replace(/\r?\n|\r/g, '').replace(/ +(?= )/g, '');
      //console.log(vm.value);
    }

    function setHoverElementPosition() {
      var withPadding = vm.hoverElementType == vm.hoverElementTypes.BORDERED;
      withPadding = false
      if(vm.setBack){
        hoverElement.css({
        top: $element.offset().top - (withPadding ? 20 : 0),
        left: $element.offset().left - (withPadding ? 20 : 0),
        width: $element.outerWidth() + (withPadding ? 40 : 0),
        height: $element.outerHeight() + (withPadding ? 20 : 0)
       });
      }
      else{
        hoverElement.css({
        top: $element.offset().top - (withPadding ? 20 : 0),
        left: $element.offset().left - (withPadding ? 20 : 0),
        width: $element.outerWidth() + (withPadding ? 40 : 0),
        height: $element.outerHeight() + (withPadding ? 40 : 0)
      });
      }
      

      if (vm.hoverElementType == vm.hoverElementTypes.IMAGE) {
        setHoverImageElementScale();
      }
    }

    function setEditableElementStyle() {
      if (!vm.editable) {
        return;
      }

      var inheritedAttributes = ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color','white-space','background-color'];
      var fieldsElement = hoverElement.find('.c-hover__fields');
      var fieldsInputs = fieldsElement.find('input, textarea');

      inheritedAttributes.forEach(function (attributeName) {
        fieldsInputs.css(attributeName, $element.css(attributeName));

      });
    }

    function setHoverImageElementScale() {
      var imageElementWidth = 220;
      var imageElementHeight = 260;
      var widthScale = 1;
      var heightScale = 1;

      if (hoverElement.outerWidth() < imageElementWidth) {
        widthScale = hoverElement.width() / imageElementWidth;
      }

      if (hoverElement.outerHeight() < imageElementHeight) {
        heightScale = hoverElement.height() / imageElementHeight;
      }

      var scale = widthScale < heightScale ? widthScale : heightScale;

      if (scale <= 1) {
        hoverImageElement.css({
          '-webkit-transform': 'scale(' + scale + ')',
          '-moz-transform': 'scale(' + scale + ')',
          '-ms-transform': 'scale(' + scale + ')',
          '-o-transform': 'scale(' + scale + ')',
          'transform': 'scale(' + scale + ')'
        });
      }
    }

    function addOnMouseEnterAndLeaveEvent() {
      var setBackElement; 
      $element.mouseenter(function (e) {
        hoverElement.fadeIn(200);
        //e.stopPropagation();
        if(vm.setBack){
          setBackElement = hoverElement;
        }
      }).mouseleave(function(e) {
         if(vm.setBack){
          hoverElement.fadeOut(200);
          e.stopPropagation();
         }
         
      })

      hoverElement.mouseleave(function (e) {
        if (!vm.isEditing) {
          hoverElement.fadeOut(200);
        }
      })
    }

    function updateHoverElementPositionOnMainResize() {
      var resizePromise = jibbarBuilder.getMainResizePromise();
      if (resizePromise) {
        resizePromise.then(null, null, function () {
          setHoverElementPosition();
        });
      }
    }
  
  function openPopup(type) {
    if(type == vm.hoverElementTypes.IMAGE)
      openImagesPopup();
  }

    function openImagesPopup() {
        
      var arg = {
         'link': imageElement.attr('src'),
          'element': imageElement
        };  
      if($attrs['width']) arg.width = $attrs['width'];
      if($attrs['height']) arg.height = $attrs['height'];
      if($attrs['imageWidth']) arg.width = $attrs['imageWidth'];
      if($attrs['imageHeight']) arg.height = $attrs['imageHeight'];

      $rootScope.$broadcast('image-edit', arg);
      $rootScope.$broadcast('image-update', arg);
      jibbarPopup.open('builder-images');
    }

    function edit() {

      if (vm.isLink) {
        //jibbarPopup.open('builder-link');
        openBuilderLinkPopup();

      } else {
        vm.isEditing = !vm.isEditing;
        $element.attr('contenteditable', vm.isEditing);
        $element.focus();

        if (!vm.isEditing) {
          $element.text(vm.value);
          hoverElement.fadeOut(200);
          triggerUpdateEmailBodyEvent();
        }
      }

      jibbarBuilder.updateCustomizableDirectivesPosition();
    }

    function remove($event) {
      if(vm.removeParent){
        //console.log('parent-to-remove');
        var parent =  $element.parent();
         //console.log($attrs);
         var updateMaxlengthOf = null;
         var updateMaxlengthTo = null;
         if(typeof($attrs['updateMaxlengthOf'])!='undefined' && typeof($attrs['updateMaxlengthTo'])!='undefined'){
            updateMaxlengthOf = $attrs['updateMaxlengthOf'];
            updateMaxlengthTo = $attrs['updateMaxlengthTo'];
            
         }
         
        var count=0;
        while(typeof(parent.data('removeParent'))=='undefined'){
          
          //console.log('selected Node details: ', parent.data('removeParent'));
          parent = parent.parent();
          count++;
          if(count>=30) break;
        }
        
        //console.log(parent);
        if(typeof(parent.data('removeParent'))!='undefined')
        {
          if(typeof(parent.data('siblingWidth'))!='undefined'){
            //console.log(parent.data('siblingWidth'));
            parent.siblings().css( "width", parent.data('siblingWidth') );
            //console.log(parent.data('siblingWidth'));
          }
          var e_id = "#"+updateMaxlengthOf;
          var elementToBeUpdated = parent.siblings().find(e_id);  //angular.element($document.querySelector('#'+$attrs['updateMaxlengthOf']));
          var currentMaxlength = elementToBeUpdated.attr('maxlength');

          var isBigger = (((+updateMaxlengthTo) > (+currentMaxlength || 0))&& (+updateMaxlengthTo >0));
          //console.log(isBigger);
          if(isBigger){
                elementToBeUpdated.attr('maxlength',updateMaxlengthTo);
              $rootScope.$broadcast('maxlength-update', {
                'maxlength': elementToBeUpdated.attr('maxlength'),
                'id': elementToBeUpdated.attr('id'),
                'element': elementToBeUpdated
                 });
          }
          
          //console.log(elementToBeUpdated.attr('maxlength'));

          //parent.fadeOut(200);
          parent.remove();

        }
        
        //console.log($element.next('[parent-to-remove]'));
       //$element.next('[parent-to-remove]').fadeOut(200);
      }

      else
      {
        //$element.fadeOut(200);
        $element.remove();
      }
      
      
     // hoverElement.fadeOut(200);
      hoverElement.remove();
      triggerUpdateEmailBodyEvent();
      $event.stopPropagation();
    }

    function clone() {
      var $clone = $element.clone();
      $element.after($clone);
      $clone.attr('removable', '');
      $compile($clone)($scope);

      triggerUpdateEmailBodyEvent();

    }

    function openBuilderLinkPopup() {
     // console.log($element.text()+" : "+$element.attr('href')+" => "+vm.linkOnly);
     var url = ($element.attr('href') == null || $element.attr('href')=="" || $element.attr('href') =="#") ? "http://" : $element.attr('href');
      jibbarPopup.open('builder-link', {
        text: $element.text(),
        link: url,
        linkOnly: vm.linkOnly
      }, function (data) {
        if (data) {
          if (!vm.linkOnly) $element.text(data.text);
           $element.attr('href', data.link);
           $rootScope.$broadcast('anchor-update', {
            'link': $element.attr('href'),
            'text': $element.text(),
            'element': $element
             });
        }
      });
    }

    function triggerUpdateEmailBodyEvent() {
      jibbar.event.trigger(jibbar.event.events.UPDATE_EMAIL_BODY_EVENT);
    }

    function isImage() {
      return vm.hoverElementType == vm.hoverElementTypes.IMAGE;
    }

    function fieldKeyPress($event) {
      if(vm.maxlength == null) return;
      if (getLengthLeft() <= 0) {
        $event.preventDefault();
      }

      vm.value = vm.value.substr(0, vm.maxlength);
    }

    function getLengthLeft() {
      return vm.maxlength - vm.value.length;
    }
  }
})();