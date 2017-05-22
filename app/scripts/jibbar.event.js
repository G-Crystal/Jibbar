var jibbar = jibbar || {};
(function ($) {
 /* SIMPLE EVENT BUS *****************************************/	
 
    jibbar.event = (function () {
		var events = {};		
		events.SIGNEDIN_EVENT = "signed-in";
        events.COUNTRY_LOADED_EVENT = "country-loaded";
        events.RESET_POPUP_GROUP_EVENT = "reset-popup-group";
        events.UPDATE_EMAIL_BODY_EVENT = "reset-update-email-body";
        events.SWITCH_VIEW_RECIPIENT_EVENT = "switdh-view-recipient-event";
        events.UPDATE_CREDIT_BALANCE_EVENT = "update-credit-balance-event";
		events.PROFILE_PICTURE_CHANGED = "profile-picture-changed";
        events.UPDATE_ANALYTICS_CHART_DATA_EVENT = "update-analytics-chart-data";
        events.RESET_CONFIRMATION_POPUP_EVENT = "reset_popup_confirmation_event";
        events.UNDO_LAST_EDIT_EVENT = "undo_last_edit";
        events.RESET_DESTINATION_EVENT = "reset_destination";
        var _callbacks = {};

        var on = function (eventName, callback) {
            if (!_callbacks[eventName]) {
                _callbacks[eventName] = [];
            }

            _callbacks[eventName].push(callback);
        };

        var off = function (eventName, callback) {
            var callbacks = _callbacks[eventName];
            if (!callbacks) {
                return;
            }

            var index = -1;
            for (var i = 0; i < callbacks.length; i++) {
                if (callbacks[i] === callback) {
                    index = i;
                    break;
                }
            }

            if (index < 0) {
                return;
            }

            _callbacks[eventName].splice(index, 1);
        };

        var trigger = function (eventName) {
            var callbacks = _callbacks[eventName];
            if (!callbacks || !callbacks.length) {
                return;
            }

            var args = Array.prototype.slice.call(arguments, 1);
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i].apply(this, args);
            }
        };

        // Public interface ///////////////////////////////////////////////////

        return {
			events: events,
            on: on,
            off: off,
            trigger: trigger
        };
    })();
	
	
	
})(jQuery);
