//
// jquery.ajaxSubmit.js - Effortlessly submit forms using AJAX and JSON
//
// Developed by Cory LaViska for A Beautiful Site, LLC
//
// Licensed under the MIT license: http://opensource.org/licenses/MIT
//
if(jQuery) (function($) {
  'use strict';

  // Defaults
  $.ajaxSubmit = {
    defaults: {
      // Request options
      url: function() {
        return $(this).attr('action');
      },
      method: function() {
        return $(this).attr('method');
      },
      headers: undefined,
      data: function() {
        return $(this).serialize();
      },
      after: function() {},
      before: function() {},
      error: function() {},
      success: function() {},

      // UI options
      loader: '.form-loader',
      message: '.form-message',
      messageErrorClasses: 'alert alert-danger',
      messageSuccessClasses: 'alert alert-success',
      hideInvalid: function(input) {
        $(input).removeClass('is-invalid');
      },
      showInvalid: function(input) {
        $(input).addClass('is-invalid');
      }
    }
  };

  // Create the plugin
  $.extend($.fn, {
    ajaxSubmit: function(method, options) {
      if(typeof method === 'object') options = method;

      // Public API
      switch(method) {
      case 'busy':
        return $(this).each(options === false ? unbusy : busy);

      case 'destroy':
        return $(this).each(destroy);

      case 'disable':
        return $(this).each(options === false ? enable : disable);

      case 'reset':
        return $(this).each(reset);

      default:
        return $(this).each(function() {
          create.call(this, $.extend({}, $.ajaxSubmit.defaults, options));
        });
      }
    }
  });

  // Make the form busy
  function busy() {
    var form = this;
    var options = $(form).data('options.ajaxSubmit');

    $(form)
      .addClass('ajaxSubmit-busy')
      .find(options.loader).prop('hidden', false);
  }

  // Create (initialize) it
  function create(options) {
    $(this)
      .data('options.ajaxSubmit', options)
      .on('submit.ajaxSubmit', submit);
  }

  // Destroy it
  function destroy() {
    $(this)
      .removeData('options.ajaxSubmit')
      .off('.ajaxSubmit');
  }

  // Disable all form elements
  function disable() {
    $(this)
      .addClass('ajaxSubmit-disabled')
      .find(':input').prop('disabled', true);
  }

  // Enable all form elements
  function enable() {
    $(this)
      .removeClass('ajaxSubmit-disabled')
      .find(':input').prop('disabled', false);
  }

  // Hide invalid field errors
  function hideInvalid() {
    var form = this;
    var options = $(form).data('options.ajaxSubmit');

    // Loop through each invalid field and run `hideInvalid`
    $(form).find('.ajaxSubmit-invalid').each(function() {
      var input = this;

      $(input).removeClass('ajaxSubmit-invalid');
      options.hideInvalid.call(form, input);
    });
  }

  // Hide the form message
  function hideMessage() {
    var form = this;
    var options = $(form).data('options.ajaxSubmit');

    $(form).find(options.message)
      .text('')
      .prop('hidden', true);
  }

  // Reset the form
  function reset() {
    unbusy.call(this);
    hideInvalid.call(this);
    hideMessage.call(this);
    this.reset();
  }

  // Show invalid field errors
  function showInvalid(fields) {
    var form = this;
    var options = $(form).data('options.ajaxSubmit');

    // Loop through each invalid field and run `showInvalid`
    $.each(fields, function(index, value) {
      var input = $(form).find(':input[name="' + value + '"]').get(0);

      $(input).addClass('ajaxSubmit-invalid');
      options.showInvalid.call(form, input);
    });
  }

  // Show the form message
  function showMessage(message, success) {
    var form = this;
    var options = $(form).data('options.ajaxSubmit');

    $(form).find(options.message)
      .removeClass(success ? options.messageErrorClasses : options.messageSuccessClasses)
      .addClass(success ? options.messageSuccessClasses : options.messageErrorClasses)
      .text(message)
      .prop('hidden', false);
  }

  // Handle form submission
  function submit(event) {
    var form = this;
    var options = $(form).data('options.ajaxSubmit');

    event.preventDefault();

    // Don't allow submission if the form is busy
    if($(form).is('.ajaxSubmit-busy')) return;

    // Run the before callback (returning false here will prevent submission)
    if(options.before.call(form) === false) return;

    // Make the form busy and hide invalid fields/messages
    hideMessage.call(form);
    hideInvalid.call(form);
    busy.call(form);

    // Send the request
    $.ajax({
      url: typeof options.url === 'function' ? options.url.call(form) : options.url,
      type: typeof options.method === 'function' ? options.method.call(form) : options.method,
      data: typeof options.data === 'function' ? options.data.call(form) : options.data,
      headers: options.headers,
      dataType: 'json'
    })
      .done(function(res) {
        // Remove busy state
        unbusy.call(form);

        // Show the message if `res.message` exists
        if(res && res.message) {
          showMessage.call(form, res.message, true);
        }

        // Show invalid fields if `res.invalid` exists
        if(res && res.invalid && res.invalid.length) {
          showInvalid.call(form, res.invalid);
        }

        // Run the success callback
        options.success.call(form, res);

        // Run the after callback
        options.after.call(form, res);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        var res = jqXHR.responseJSON;

        // Remove busy state
        unbusy.call(form);

        // Show the message if `res.message` exists
        if(res && res.message) {
          showMessage.call(form, res.message, false);
        }

        // Show invalid fields if `res.invalid` exists
        if(res && res.invalid && res.invalid.length) {
          showInvalid.call(form, res.invalid);
        }

        // Run the error callback
        options.error.call(form, res, errorThrown);

        // Run the after callback
        options.after.call(form, res);
      });
  }

  // Remove the form's busy state
  function unbusy() {
    var form = this;
    var options = $(form).data('options.ajaxSubmit');

    $(form)
      .removeClass('ajaxSubmit-busy')
      .find(options.loader).prop('hidden', true);
  }
})(jQuery);
