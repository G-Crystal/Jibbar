(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/templates-gallery/templates-gallery.html',
    controller: TemplatesGalleryController,
    bindings: {
      isTesting: '<',
      onCategoryChange: '&',
      isPopup: '<',
      page: '<'
    }
  };

  angular
    .module('jibbar.templates-gallery')
    .component('jibbarTemplatesGallery', componentConfig);

  TemplatesGalleryController.$inject = ['$element', '$scope', '$timeout', 'templateService', '$window', '$state', '$stateParams','$sce'];

  function TemplatesGalleryController($element, $scope, $timeout, templateService, windowService, $state,$stateParams, $sce) {
    var vm = this;
    vm.page_filter = (typeof(vm.page)=='undefined') ? "" : vm.page.page;
    vm.$onInit = $onInit;
    vm.$postLink = $postLink;
    vm.templateCategories = null;
    vm.selectedCategory = null;
    vm.templates = null;
    vm.my_favourites = [];
    vm.templatePercentWidth = null;
    vm.saveTemplate = saveTemplate;
    vm.selectCategory = selectCategory;
    vm.getTemplatesListHeight = getTemplatesListHeight;
    vm.getTemplateTestCategoryHeight = getTemplateTestCategoryHeight;
    vm.getTemplateElementTopPosition = getTemplateElementTopPosition;
    vm.getTemplateElementLeftPosition = getTemplateElementLeftPosition;
    vm.openWindow = openWindow;
    vm.saveAsFavourite = saveAsFavourite;
    vm.fetchMyFavouriteTemplates = fetchMyFavouriteTemplates;
    vm.removeFromFavourite = removeFromFavourite;
    vm.checkFavouriteAction = checkFavouriteAction;
    vm.toTrustedHTML = toTrustedHTML;

    ///////

    var $window = angular.element(window);
    var $categoriesElement = null;
    var $templatesListElement = null;
    var templatesListWidth = null;
    var templatesInRowCount = null;
    var templateTestCategoryHeight = null;
    

    function $onInit() {
      $categoriesElement = $element.find('.c-templates-gallery__categories');
      $templatesListElement = $element.find('.c-templates-gallery__templates');

      setTemplatesWidthAndWatchForChanges();
      setTemplatesInRowCountAndWatchForChanges();
      fetchMyFavouriteTemplates();
      fetchTemplateCategories();
      
      
      if (vm.isPopup) {
        handleFixedCategoriesPosition();

      }      
    }

    function $postLink() {
      if (vm.isTesting) {
        $timeout(function () {
          setTemplateTestCategoryHeightAndWatchForChanges();
        }, 50);
      }
    }

    function saveTemplate(template) {
      template.isSaved = !template.isSaved;
      // TODO
    }

    function selectCategory(category) {
      if (category == vm.selectedCategory) {
        vm.selectedCategory = null;
        vm.onCategoryChange({newCategory: vm.selectedCategory});
        //fetchInitialTemplates();
        return;
      }

      vm.selectedCategory = category;

      $.grep(category.email_templates, function(e){ if(_.includes(vm.my_favourites,e.id)) e.is_favourite = true;});
            
      //console.log(vm.page_filter);
      // filter: all
      if(vm.page_filter == 'list'){
        vm.templatesCurrent = category.email_templates;
      }
      
      // filter: new
      else if(vm.page_filter=='new'){
        vm.templatesCurrent  = _.take(_.orderBy(category.email_templates, ['created_at'], ['desc']), 10);
        
      }

      // filter: favourites
      else if(vm.page_filter=='favourite'){
        vm.templatesCurrent  = [];
        
        vm.templatesCurrent  = $.grep(category.email_templates, function(e){ return  _.includes(vm.my_favourites,e.id);});
        //console.log(vm.templatesCurrent);
      }
      // filter: trending
      else if(vm.page_filter=='trend'){
        
        vm.templatesCurrent  = _.take(_.orderBy(category.email_templates, ['favourite_count'], ['desc']), 10);

        
      }
      else{
        vm.templatesCurrent = category.email_templates;
      }

      vm.onCategoryChange({newCategory: vm.selectedCategory});
    }

    function fetchTemplateCategories() {

        templateService.getEmailTemplateTypes().then(function (data) {
            vm.templateCategories = data.items;
            vm.templatesAll = templateService.getTemplates();
            vm.templatesCurrent = vm.templatesAll;
            vm.selectCategory(vm.templateCategories[0]);

        });
        
    }
    function fetchMyFavouriteTemplates(){
      if(templateService.isLoadedFavourites()){
          vm.my_favourites = templateService.getMyFavouriteTemplates().map(function(item) { return item.template_id});
        }
        else{
          templateService.loadMyFavouriteTemplates().then(function (data) {
          vm.my_favourites = data.data.map(function(item) { return item.template_id});
        },function (error){
             console.log('something went wrong');
        });
        }
      }

    function handleFixedCategoriesPosition() {
      var $popup = $element.parents('jibbar-popup');

      $popup.scroll(function () {
        $categoriesElement.css('top', $popup.scrollTop());
      });
    }

    /////// Templates List Floating Elements

    function setTemplatesWidthAndWatchForChanges() {
      templatesListWidth = $templatesListElement.width();

      $window.resize(function () {
        $scope.$apply(function () {
          templatesListWidth = $templatesListElement.width();
        });
      });
    }

    function setTemplatesInRowCountAndWatchForChanges() {
      function setCount() {
        var divider = 350;
        if ($templatesListElement.width() <= 1100) {
          divider = 310;
        }

        templatesInRowCount = Math.floor($templatesListElement.width() / divider);
        vm.templatePercentWidth = (100 - ((templatesInRowCount - 1) * 2)) / templatesInRowCount;
      }

      $window.resize(function () {
        $scope.$apply(function () {
          setCount();
        });
      });

      setCount();
    }

    function setTemplateTestCategoryHeightAndWatchForChanges() {
      function setHighest() {
        var highest = 0;

        $element.find('.c-templates-gallery__template-category-container').each(function () {
          if ($(this).height() > highest) {
            highest = $(this).outerHeight();
          }
        });

        templateTestCategoryHeight = highest;
      }

      $window.resize(function () {
        $timeout(function () {
          setHighest();
        }, 400);
      });

      setHighest();
    }

    function getTemplatesListHeight() {
      var templatesCount = angular.isObject(vm.templates) ? vm.templates.length : 1;
      var height = (Math.floor((templatesCount - 1) / templatesInRowCount) + 1) * (getTemplateElementSize() + 15) - 15;

      if (vm.isTesting) {
        height += (Math.floor((templatesCount - 1) / templatesInRowCount) + 1) * (getTemplateTestCategoryHeight() + 20);
      }

      return height;
    }

    function getTemplateTestCategoryHeight() {
      return templateTestCategoryHeight;
    }

    function getTemplateElementTopPosition(index) {
      if (index > (templatesInRowCount - 1)) {
        var top = Math.floor(index / templatesInRowCount) * (getTemplateElementSize() + 15);

        if (vm.isTesting) {
          top += Math.floor(index / templatesInRowCount) * (getTemplateTestCategoryHeight() + 20);
        }

        return top;
      }
    }

    function getTemplateElementLeftPosition(index) {
      return index % templatesInRowCount * (getTemplateElementPercentWidth() + 2) + '%';
    }

    function getTemplateElementSize() {
      return templatesListWidth * getTemplateElementPercentWidth() / 100;
    }

    function getTemplateElementPercentWidth() {
      return (100 - ((templatesInRowCount - 1) * 2)) / templatesInRowCount;
    }

    function openWindow(templateId) {
        var url = $state.href('templatePreview', { templateId: templateId });
        windowService.open(url, '_blank', 'fullscreen=yes, channelmode=1,scrollbars=1,status=0,titlebar=0,toolbar=0,resizable=1');
    }

    function saveAsFavourite(templateObj){
      
      
      templateService.saveAsFavourite({template: templateObj.id}).then(function (data) {
            //console.log(data);
        },
        function(error){
          console.log('something went wrong');
        });
    }
    function removeFromFavourite(templateObj){
      
      
      templateService.removeFromFavourite({template: templateObj.id}).then(function (data) {
            //console.log(data);
        },
        function(error){
          console.log('something went wrong');
        });
    }

    function checkFavouriteAction(templateObj){
       if(typeof(templateObj.is_favourite)!=='undefined' && templateObj.is_favourite)
        removeFromFavourite(templateObj);
       else
        saveAsFavourite(templateObj);

    }

    function toTrustedHTML(html){
        return $sce.trustAsHtml(html);
    }
    
  }
})();
