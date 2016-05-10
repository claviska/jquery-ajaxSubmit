# jquery.ajaxSubmit.js - Effortlessly submit forms using AJAX and JSON

Developed by Cory LaViska for A Beautiful Site, LLC.

Licensed under the MIT license: http://opensource.org/licenses/MIT

## Overview:

This plugin provides a minimal, lightweight solution to submit forms using AJAX and JSON. There is no client side validation included, as that is outside the scope of this plugin. All validation is expected to happen on the server.

Features:

- Makes regular HTML forms AJAX-capable.
- Minimal markup.
- Handles form serialization so you don't have to.
- Shows/hides a loader and message if you provide them.
- Highlights invalid fields.
- Callbacks for success, fail, before, and after.
- API to disable/enable all form inputs.
- API to reset the form (including loader, message, and invalid fields)

## Form syntax

Create a form as you normally would in HTML. The `action` and `method` attributes will be used as the target URL and method (`GET` or `POST`) for the AJAX request.

You can add a loader container anywhere inside the form that will be shown/hidden automatically when the form is submitted:

```html
<div class="form-loader">
    <img src="loader.gif">
</div>
```

You can add a message container anywhere inside the form that will be shown/hidden and populated automatically when the form receives a message from the server:

```html
<div class="form-message"></div>
```

## Attaching the plugin

Minimal example that logs the server's response if successful:

Minimal example:

```javascript
$('form').ajaxSubmit({
    success: function(res) {
        console.log(res);
    }
});
```

Example with all possible options:

```javascript
$('form').ajaxSubmit({
    // Options (default shown)
    loader: '.form-loader',
    message: '.form-message',
    hideInvalid: function(input) {
        $(input).closest('.form-group').removeClass('has-warning');
    },
    showInvalid: function(input) {
        $(input).closest('.form-group').addClass('has-warning');
    }

    // Callbacks
    after: function(res) { ... },
    before: function() { ... },
    error: function(res) { ... },
    fail: function(res) { ... },
    success: function(res) { ... }
});
```

### Options

- `loader`: A selector that points to the form's loader. This will be shown/hidden automatically using the HTML `hidden` property. Defaults to `.form-loader`.

- `message`: A selector that points to the form's message container. This will be shown/hidden automatically using the HTML `hidden` property. Defaults to `.form-message`.

- `showInvalid`: This function will be called on all invalid inputs as returned by res.invalid. Use it to apply error styles, etc. The default behavior is compatible with Bootstrap 4 and will highlight the closest `.form-group` using the `.has-warning` class.

- `hideInvalid`: This function will be called on all invalid inputs to effectively undo the changes made by the `showInvalid` function.

Custom options example:

```javascript
$.ajaxSubmit.loader = '.my-loader-container';
$.ajaxSubmit.message = '.my-message-container';

$.ajaxSubmit.config.showInvalid = function(input) {
    $(input).addClass('error');
};

$.ajaxSubmit.config.hideInvalid = function(input) {
    $(input).removeClass('error');
};
```

You may also update the default options *before instantiation*:

```javascript```
$.ajaxSubmit.defaults.optionName = yourValue;
```

### Callbacks

All callbacks are called in the context of the respective form (i.e. refer to the form using `this` inside your callbacks).

All callbacks except `before` and `error` return the server's JSON response as their first argument.

- `after`: runs after the request has completed and your server returns a response.
- `before`: runs before the request is sent. Returning `false` will cancel submission.
- `error`: runs when an XHR (AJAX) error occurs.
- `fail`: runs when your server returns an unsuccessful response.
- `success`: runs when your server returns a successful response.

## Responding from the server

Your server should always return a well-formed JSON response. The response can contain any data you want, but there are a few reserved properties:

```javascript
{
    "success": false,
    "invalid": ["username", "password"],
    "message": "Invalid username or password"
}
```

- `success`: Required. This property should always be `true` or `false`. *It does not indicate that the XHR request succeeded*, but rather the form was submitted and accepted by your server without validation errors.

- `invalid`: Optional. An array of field names to be marked erroneous by the plugin.

- `message`: Optional. A string of plain text that will be injected into the message container.

### Responding with PHP

In PHP, you can return a JSON response like this:

```php
<?php
exit(json_encode([
    'success': true,
    'invalid': ['username', 'password'],
    'message': 'Invalid username or password'
]));
```