(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/prepare/prepare.html',
    controller: TemplatesPrepareController,
    bindings: {
      sketch: '<'
    }
  };

  angular
    .module('jibbar.dashboard.templates.prepare')
    .component('jibbarDashboardTemplatesPrepare', componentConfig);

  TemplatesPrepareController.$inject = ['appSettings','jibbarPopup','emailService', 'authService', 'paymentService', '$state', 'toastr', '$stateParams', '$timeout','backService','$scope','statemoveService'];

  function TemplatesPrepareController(appSettings, jibbarPopup,emailService, authService, paymentService, $state, toastr, $stateParams,$timeout, backService, $scope, statemoveService) {
    var vm = this;
    vm.getFolding = getFolding;
    vm.toggleItem = toggleItem;
    vm.$onInit = $onInit;
    vm.fetchPlans              =fetchPlans;



   


 //All the flag to manage UI
    vm.showPurchaseCreditOption   = false;
    vm.isAllowSendEmail           = false;
    vm.notice                     = null;
    vm.recurrentPlan              = true;
    vm.selectPlan                 = false;
    vm.showOrder                  = false;
    vm.showCardChange             = false;
    vm.showAddressChange          = false;
    vm.planSelected               = false;
    vm.topUpCreditSelected        = false;
    vm.showHandlingFee            = false;
    vm.submitted                  = false; 
    vm.isScheduled                = false;

//Actions: Updating shopping cart
    vm.removeFromCartPlan    = removeFromCartPlan;
    vm.removeFromCartCredit  = removeFromCartCredit;
    vm.subscribePlan         = subscribePlan;
    vm.topUpCredits          = topUpCredits;
    vm.changePlan            = changePlan;
    vm.chargeHanflingFee     = chargeHanflingFee;
    
    
    
  
//Actions: managing customers
    vm.getCustomerDetails       = getCustomerDetails;
    vm.updateCustomer           = updateCustomer;
    vm.changeCreditCard         = changeCreditCard;
    vm.changeInvoiceAddress     = changeInvoiceAddress;
    vm.changeDefaultCreditCard  = changeDefaultCreditCard; 
    vm.removePaymentSource      = removePaymentSource;
    vm.changeShippingAddress    = changeShippingAddress;
    vm.addNewPaymentSource      = addNewPaymentSource; 
    

//Actions: Stripe payment processing: credit card, subscriptions and charge    
    vm.createToken            = createToken;
    vm.stripeResponseHandler  = stripeResponseHandler;
    vm.processPayment         = processPayment;
    vm.createSubscription     = createSubscription;
    vm.createCharge           = createCharge;
    
    vm.calculateTotalAmount    = calculateTotalAmount; 
    vm.reCheckingAllowance     = reCheckingAllowance;
    vm.showPurchaseOption      = showPurchaseOption; 
    vm.addHandlingFeeToOrder   = addHandlingFeeToOrder;
    vm.updateBalance           = updateBalance;
    vm.checkAllowance          = checkAllowance;
    vm.sentBroadcastCostInfo   = sentBroadcastCostInfo;
    vm.openConfirmationPopup   = openConfirmationPopup;
   // vm.openDiscardPopup        = openDiscardPopup;
    vm.saveDraft               = saveDraft; 
    vm.purchaseCredits         = purchaseCredits;
    vm.updateUserSubscriptionRole = updateUserSubscriptionRole;
    vm.getUserSubscriptionRole    = getUserSubscriptionRole;
  
    vm.plan               = {cpc:0.00};
    vm.recipients         = 0; 
    vm.balance            = 0; 
    vm.tax_percent        = 0.0; //10% GST
    vm.gst                = 10;
    vm.total_amount       =0;
    vm.creditPerRecipient = 0; //credit_consumed where code==CC001 Credit consumption per recipient in a broadcast
    vm.handlingFee        = 0.00; //credit_consumed where code==CC002 Handling fee per broadcast
    vm.totalCreditsNeeded = 0;
    vm.creditBalance    = 0;
    vm.broadcastBalance = 0;
    vm.schedule         = null;
    vm.recipientsList   = [];
    vm.broadcastInfo    = {};
    vm.charge           = {};
    vm.findPlan         = findPlan;
   
    ////////////////Notification on leaving editor start/////////////////////////////////////////
    $scope.$on("$stateChangeStart", function(event, next, current){
      statemoveService.checkMove(event,'dashboard.templates.prepare',next,current.proceed);
    });
    ////////////////Notification on leaving editor end/////////////////////////////////////////
   
    function $onInit() {
      backService.setCurrentPage('dashboard.templates.prepare');
      authService.getUserInfo().then(function (result) {
        vm.user = result.data;
        vm.getCustomerDetails();
        vm.fetchPlans();

        vm.isScheduled = $stateParams.isScheduled;
        if(vm.isScheduled)
           vm.schedule = $stateParams.schedule;
       
      });

     
    }


    jibbar.event.on(jibbar.event.events.UPDATE_CREDIT_BALANCE_EVENT, function (data) {
      updateBalance(data);

    });

  
  jibbar.event.on(jibbar.event.events.UPDATE_USER_SUB_ROLE_EVENT, function (data) {
      updateUserSubscriptionRole(data);
      vm.checkAllowance();
    });


  function updateUserSubscriptionRole(data){
        vm.creditBalance        = data.creditBalance;
        vm.broadcastBalance     = data.broadcastBalance;
        vm.subscriptionExpireOn = data.showPurchaseOption;
  }
    
    function getUserSubscriptionRole() {
      authService.getCurrentUserSubscriptionRole().then(
        function (result) {
           if (result.success) {
              //   debugger
                if(result.data.creditBalance == vm.creditBalance && result.data.broadcastBalance == vm.broadcastBalance  && result.data.subscriptionExpireOn == vm.subscriptionExpireOn)
                   $timeout(function(){vm.getUserSubscriptionRole();}, 3000)
                else   
                   jibbar.event.trigger(jibbar.event.events.UPDATE_USER_SUB_ROLE_EVENT, result.data);
              }
            } 
          );
       }

    
    function checkAllowance() {
      authService.getCurrentUserSubscriptionRole().then(
        function (result) {
          emailService.isAllowedToSend().then(
            function (result) {
              if (result.success) {
              //  vm.subscription = result.result;
                jibbar.event.trigger(jibbar.event.events.UPDATE_CREDIT_BALANCE_EVENT, result.data);

              }
              else {
                vm.notice = 'Insufficient Credits! Please Purchase some credit.';
                toastr.error("Insufficient Credits! Please Purchase some credit.");
              }
            },
            function (error) {
              toastr.error("something went wrong!!");
            }
          );
        },
        function (error) {
          toastr.error('something went wrong');
        }

      );

    }

    function updateBalance(data) {

      vm.recipients   = data.totalRecipients;
      vm.balance      = data.balance;
      vm.creditPerRecipient = data.creditPerRecipient; //credit_consumed where code==CC001 Credit consumption per recipient in a broadcast
      // vm.handlingFee = data.handlingFee; //credit_consumed where code==CC002 Handling fee per broadcast
      vm.totalCreditsNeeded = data.totalCreditsNeeded;
      vm.creditBalance = data.creditBalance;
      vm.broadcastBalance = data.broadcastBalance;
      vm.showPurchaseCreditOption = data.showPurchaseCreditOption;
      vm.subscriptionExpireOn = data.subscriptionExpireOn;
      vm.isAllowSendEmail = reCheckingAllowance();

      vm.showPurchaseOption();

    }

    function showPurchaseOption() {
      //Offering to purchase credits
      if ((Number(vm.creditBalance) - Number(vm.totalCreditsNeeded)) < 0)
        vm.toggleItem('credits');
      //Offering to subscribe a plan
      if ((Number(vm.broadcastBalance) - 1) < 0)
        vm.toggleItem('plan');

      //Show an way out to make the broadcast.     
      if (vm.broadcastBalance == 0)
        vm.addHandlingFeeToOrder();
    }


    function addHandlingFeeToOrder() {
        
      if(this.customer.Customer.plan.id == appSettings.TestDrivePlanID ||this.customer.Customer.plan.id == appSettings.PAYGPlanCode )  
         {
           var paygPlan = vm.plans.find(vm.findPlan);
          subscribePlan(paygPlan);
        }
      else {
        if (vm.customer.Customer.plan && vm.broadcastBalance == 0) {
          vm.showOrder = true;
          vm.showHandlingFee = true;
        }
      }
    }

    function reCheckingAllowance() {
      var currentDateTime = new Date().toISOString(); 
      var status = (vm.creditBalance >= vm.totalCreditsNeeded && vm.broadcastBalance >= 1 &&   vm.subscriptionExpireOn >= currentDateTime)? true : false;
          if(status){
            vm.showOrder = false;
            vm.showHandlingFee = false;
          //  vm.showPurchaseOption = false;
          }  
        return status;  
    }

    var folding = {
      plan: false,
      credits: false,
      address: false,
      cards: false
    };


    function getFolding() {
      return folding;
    }

    function toggleItem(name) {
      Object.keys(folding).forEach(function (key) {
        folding[key] = (key == name) && (folding[key] != true);
      });
    }






    function getCustomerDetails() {
      paymentService.getCustomerDetails(vm.user).then(
        function (result) {
          if (result.success) {
            vm.customer = result.results
            vm.shipping = vm.customer.Customer.shipping;
            vm.cards = vm.customer.Card;
            vm.currentPlan = vm.customer.Plan;

            //Identify default card. Stripe return default card as a first payment source.
            if (vm.cards.length > 0)
              vm.cards[0].isDefault = true;

            //Retrieve Handling Fee.
            vm.handlingFee = Number(vm.customer.Customer.handling_fee)

            //Check is Allowed to send email
            vm.checkAllowance();
          }
        },
        function (error) {
          toastr.error(error);
        }
      )
    }


    function createToken(form) {
      vm.submitted = true; //Disable submit button
      Stripe.card.createToken(vm.card, vm.stripeResponseHandler);

    }


    function stripeResponseHandler(status, response) {
      if (response.error) {
        toastr.error(response.error.message);
        vm.notice = response.error.message;
        toastr.error(response.error.message);
        vm.submitted = false; //Re-enable submission button 
      }
      else {
        var data = {
          id: vm.customer.Customer.stripe_customer_id,
          source: response.id
        }
        vm.showCardChange = false;
        vm.addNewPaymentSource(data);
      }
    }

    function addNewPaymentSource(customer) {
      paymentService.addNewPaymentSource(customer).then(
        function (result) {
          if (result.success) {
            vm.customer = result.results;
            vm.getCustomerDetails();
            vm.notice = 'New payment source attached with your account'
            toastr.success('Stripe  customer updated Successfully!');
            vm.submitted = false;
          }
          else {
            toastr.error(result.error.message, result.error.param);
          }
        },
        function (error) {
          toastr.error(error.message);
        }
      )
    }


    function removePaymentSource(card) {
      var data = { id: vm.customer.Customer.stripe_customer_id, source: card.id }

      paymentService.removePaymentSource(data).then(
        function (result) {
          if (result.success) {
            vm.customer = result.results;
            vm.getCustomerDetails();
            vm.notice = card.type + 'credit card removed from your account'
            toastr.success(card.type + 'credit card removed from your account');
            vm.submitted = false;
          }
        }
      )
    }

    function updateCustomer(customer) {
      paymentService.updateCustomer(customer).then(
        function (result) {
          if (result.success) {
            vm.customer = result.results;
            vm.getCustomerDetails();
            vm.showAddressChange = false;
            vm.notice = "Your account has been updated successfully";
            toastr.success('Stripe  customer updated Successfully!');
          }
        }
      )
    }
    function changeShippingAddress() {
      vm.shipping.name = vm.user.name + " " + vm.user.surname;
      var data = { id: vm.customer.Customer.stripe_customer_id, shipping: vm.shipping }
      vm.updateCustomer(data);
    }



    function fetchPlans() {
      paymentService.getPlans(vm.user.country).then(function (result) {
        if (result.success) {
          vm.plans = result.Plans;
          vm.oneTimePlans = result.Credits;
        }
      })
    }


    function subscribePlan(plan) {
      vm.showHandlingFee = false;
      vm.planSelected = true;
      vm.showOrder = true;
      vm.recurrentPlan = true;
      vm.plan = plan;

      vm.calculateTotalAmount();
    }

    function topUpCredits(plan) {
      vm.topUpCreditSelected = true;
      vm.showOrder = true;
      vm.recurrentPlan = false;
      vm.topUpCredit = plan;
      vm.calculateTotalAmount();
    }

    function processPayment() {

       if(!vm.customer.Card || vm.customer.Card.length == 0)
       { 
         toastr.error("No payment source. Please add your payment info");
          vm.toggleItem('cards'); 
      }
      else if(!vm.shipping || vm.shipping.length == 0)
        {
          toastr.error("Please add your billing address");
          vm.toggleItem('address'); 
      }
      else{  
      if (vm.planSelected) vm.createSubscription();
      if (vm.topUpCreditSelected) vm.purchaseCredits();

      if( !vm.planSelected && !vm.topUpCreditSelected && vm.showHandlingFee) 
         {
           if(this.customer.Customer.plan.id == appSettings.TestDrivePlanID ||this.customer.Customer.plan.id == appSettings.PAYGPlanCode )  
              {
                this.plan = vm.plans.find(vm.findPlan);
                vm.createSubscription();
              }
              else
                vm.chargeHanflingFee();
   
        }
      }
    }


    function createSubscription() {
      var subscription = { public_id: vm.user.publicId, plan: vm.plan.code, customer: vm.customer.Customer.stripe_customer_id, tax_percent: vm.gst }
      paymentService.createSubscription(subscription).then(
        function (result) {
          if (result.success) {
            vm.subscription = result.results;
            vm.showOrder = false;
            vm.planSelected = false;
            vm.showHandlingFee = false;
            vm.getUserSubscriptionRole();
            vm.getCustomerDetails(); 
            vm.notice = "Your payment was successfully processed"
            toastr.success('Your payment was successfully processed');
          }
        }
      )
    }



 function chargeHanflingFee() {

    

      var credit_cost = Number(vm.handlingFee) + Number(vm.handlingFee) * (vm.gst / 100.00)
      vm.charge.validity = 1;
      vm.charge.plan = "bf101";
      vm.charge.public_id = vm.user.publicId;
      credit_cost = (credit_cost * 100);
      vm.charge.amount = credit_cost.toFixed();
      vm.charge.currency = 'usd';
      vm.charge.customer = vm.customer.Customer.stripe_customer_id;
      vm.charge.receipt_email = vm.user.emailAddress;
      vm.charge.description = "Broadcast fee for a single broacast " +vm.handlingFee;
      vm.charge.metadata={credits:0, broadcasts:1, price:Number(vm.handlingFee), gst:  Number(vm.handlingFee ) * ( vm.gst/100.00)} 
 
      vm.createCharge(vm.charge);
         vm.showOrder = false;
         vm.showHandlingFee = false;

    }
 
   
     function findPlan(plan) {
        return plan.code == appSettings.PAYGPlanCode
       }

    function purchaseCredits() {

      var credit_cost = Number(vm.topUpCredit.price) + Number(vm.topUpCredit.price) * (vm.gst / 100.00)
      vm.charge.validity = vm.topUpCredit.validity;
      vm.charge.plan = vm.topUpCredit.id;
      vm.charge.public_id = vm.user.publicId;
      credit_cost = (credit_cost * 100);
      vm.charge.amount = credit_cost.toFixed();
      vm.charge.currency = vm.topUpCredit.currency
      vm.charge.customer = vm.customer.Customer.stripe_customer_id;
      vm.charge.receipt_email = vm.user.emailAddress;
      vm.charge.description = "Purchase " + vm.topUpCredit.credits + " credits ."
      
      vm.charge.metadata={credits:Number(vm.topUpCredit.credits ), broadcasts:Number(vm.topUpCredit.broadcasts ), price:Number(vm.topUpCredit.price ), gst:  Number(vm.topUpCredit.price ) * ( vm.gst/100.00)} 


     vm.createCharge(vm.charge);
     
    }

   function createCharge(charge){
      paymentService.createCharge(charge).then(
        function (result) {
          if (result.success) {
            vm.subscribedPlan = result.results;
            vm.showOrder = false;
            vm.topUpCreditSelected = false; 
            vm.getUserSubscriptionRole();
            vm.getCustomerDetails();
            vm.notice = "Your payment was successfully processed"
            toastr.success('Top-up email credits successfully!');

          }
          else {
            toastr.error(result.error.message, result.error.param);
          }
        },
        function (error) {
          toastr.error(error);
        }
      )
   }

    function changePlan() {
      vm.selectPlan = true;
    }


    function changeCreditCard() {
      vm.showCardChange = !vm.showCardChange;

    }

    function changeDefaultCreditCard(card) {
      var data = {
        id: vm.customer.Customer.stripe_customer_id,
        default_source: card.id
      }
      vm.updateCustomer(data);

    }

    function changeInvoiceAddress() {
      vm.showAddressChange = true;
    }




    function removeFromCartPlan() {
      vm.plan = null;
      vm.planSelected = false;
      if (!vm.planSelected && !vm.topUpCreditSelected)
        vm.showOrder = false;
      if (vm.broadcastBalance == 0)
        vm.showOrder = true;

      vm.showHandlingFee = true;
      vm.calculateTotalAmount();
    }

    function removeFromCartCredit() {
      vm.topUpCredit = null;
      vm.topUpCreditSelected = false;

      if (!vm.planSelected && !vm.topUpCreditSelected)
        vm.showOrder = false;

      vm.calculateTotalAmount();
    }

    function calculateTotalAmount() {
      var price = 0.00;
      if (vm.planSelected && vm.topUpCreditSelected)
        price = Number(vm.plan.price) + Number(vm.topUpCredit.price)
      else if (vm.planSelected && !vm.topUpCreditSelected)
        price = Number(vm.plan.price)
      else if (!vm.planSelected && vm.topUpCreditSelected)
        price = Number(vm.topUpCredit.price)

      vm.tax_percent = price * 0.1;

      var total_price = price + vm.tax_percent;

      if (vm.showHandlingFee)
        total_price = total_price + vm.handlingFee;
      vm.tax_percent = vm.tax_percent.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
      vm.total_amount = total_price.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    }

function sentBroadcastCostInfo(){
  var broadcastFee = 0.0;

   if (vm.showHandlingFee)
       broadcastFee = vm.handlingFee;

   vm.broadcastInfo = {totalRecipients: vm.recipients , creditPerRecipient: vm.creditPerRecipient, broadcastFee:broadcastFee , isScheduled:vm.isScheduled }
   emailService.setCurrentBroadcastCostInfo(vm.broadcastInfo)
  
    }

 
    function openConfirmationPopup(isScheduled) {
      vm.sentBroadcastCostInfo();
       
      jibbar.event.trigger(jibbar.event.events.RESET_CONFIRMATION_POPUP_EVENT,{
         head: vm.isScheduled ? "Are you sure you want to schedule this email?" : "Are you sure you want to send this email?",
         about: vm.isScheduled ? "You can reopen an email and make changes at anytime" : "This action cannot be undone."
       });
      
      jibbarPopup.open('dashboard-templates-prepare-confirmation-popup', {
         isScheduled: vm.isScheduled
       });
    }


  function saveDraft(){
     emailService.saveEmail().then(
        function (result) {
          if (result.success) {
            $state.go('dashboard.templates.list')
          }
        },
        function (error) {

          toastr.error("Something went wrong!!!");
        }  
     ); 
  }


 
  }
})();
