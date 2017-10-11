# jquery.ajaxSubmit.js - Effortlessly submit forms using AJAX and JSON

Developed by Cory LaViska for A Beautiful Site, LLC

Licensed under the MIT license: http://opensource.org/licenses/MIT

## Overview:

This plugin provides a minimal, lightweight solution to submit forms using AJAX and JSON. There is no client side validation included, as that is outside the scope of this plugin. All validation is expected to happen on the server.

Features:

- Makes regular HTML forms AJAX-capable.
- Minimal markup.
- Handles form serialization so you don't have to.
- Shows/hides a loader and message if you provide them.
- Highlights invalid fields.
- Callbacks for success, error, before, and after.
- API to disable/enable form inputs.
- API to reset the form (including loader, message, and invalid fields)
- Compact! (about 240 lines)

## Installing

Include the minified version of this plugin in your project or install via NPM:

```
npm install --save @claviska/jquery-ajaxSubmit
```

## Form syntax

Create a form as you normally would in HTML. By default, the `action` and `method` attributes will be used as the target URL and method for the AJAX request. Alternatively, you can specify them as options (see below for details).

You can optionally add a loader container anywhere _inside_ the form that will be shown/hidden automatically when the form is submitted:

```html
<div class="form-loader">
  <img src="loader.gif">
</div>
```

You can optionally add a message container anywhere _inside_ the form that will be shown/hidden and populated automatically when the form receives a message from the server:

```html
<div class="form-message"></div>
```

## Attaching the plugin

Minimal example that logs the server's response if successful:

Minimal example with success callback:

```javascript
$('form').ajaxSubmit({
  success: function(res) {
    console.log(res);
  }
});
```

Example with all possible options and callbacks:

```javascript
$('form').ajaxSubmit({
    // Options (default values shown)
    data: function() {
      return $(this).serialize();
    },
    headers: {
      'My-Custom-Header': 'Value'
    },
    hideInvalid: function(input) {
      $(input).closest('.form-group').removeClass('has-warning');
    },
    loader: '.form-loader',
    message: '.form-message',
    messageErrorClasses: 'message-error',
    messageSuccessClasses: 'message-success',
    method: function() {
      return $(this).attr('method');
    },
    showInvalid: function(input) {
      $(input).closest('.form-group').addClass('has-warning');
    },
    url: function() {
      return $(this).attr('action');
    },

    // Callbacks
    after: function(res) { ... },
    before: function() { ... },
    error: function(res) { ... },
    success: function(res) { ... }
});
```

### Options

- `data`: The data to send to the server. This option can also be a function that returns data. By default, it uses the form's serialized data.
- `headers`: Custom headers to send along with the request.
- `hideInvalid`: A function to be called on all invalid inputs to effectively undo the changes made by the `showInvalid` function.
- `loader`: A selector that points to the form's loader. This will be shown/hidden automatically using the HTML `hidden` property. Defaults to `form-loader`.
- `message`: A selector that points to the form's message container. This will be shown/hidden automatically using the HTML `hidden` property. Defaults to `form-message`.
- `messageErrorClasses`: One or more space-separated classes to attach to the message container when the response is erroneous. Defaults to `message-error`.
- `messageSuccessClasses`: One or more space-separated classes to attach to the message container when the response is successful. Defaults to `message-success`.
- `method`: The method to use (i.e. `GET` or `POST`). This option can also be a function that returns the method. By default, it uses the form's `method` attribute.
- `showInvalid`: A function to be called on all invalid inputs as returned by `res.invalid`. Use it to apply error styles, etc. The default behavior is compatible with Bootstrap 4 beta and will add the `is-invalid` to the input.
- `url`: The URL to send the request to. This option can also be a function that returns the URL. By default, it uses the form's `action` attribute.

You may also update the default options *before instantiation*:

```javascript
$.ajaxSubmit.defaults.optionName = yourValue;
```

### Callbacks

All callbacks are called in the context of the respective form (i.e. refer to the form using `this` inside your callbacks).

The `success` and `after` callbacks return the server's JSON response as their first argument.

- `after(res)`: runs after the request has completed and your server returns a response.
- `before()`: runs before the request is sent. Returning `false` will cancel submission.
- `error(res, err)`: runs when your server returns an unsuccessful response (e.g. `400 BAD REQUEST`).
- `success(res)`: runs when your server returns a successful response (e.g. `200 OK`).

### Methods

Methods are called using this syntax:

```javascript
$('form').ajaxSubmit('method', arg);
```

The following API methods are supported:

- `busy`: sets the form's busy state. Pass in `true` or `false`.
- `create` (default): initializes the plugin.
- `destroy`: returns the form to its pre-initialized state.
- `disable`: disables/enables all inputs. Pass in `true` or `false`.
- `reset`: resets the form to its original state, including input values, loaders, and messages.

## Responding from the server

Your server should return a well-formed JSON response with an appropriate HTTP status code. The response can contain any data you want, but there are a couple reserved properties:

```javascript
{
  "invalid": ["username", "password"],
  "message": "Invalid username or password"
}
```

- `invalid`: Optional. An array of field names to be marked erroneous by the plugin.

- `message`: Optional. A string of plain text that will be injected into the message container.

### Node.js + Express

```js
res.status(400).json({
  invalid: ['username', 'password'],
  message: 'Invalid username or password'
});
```

### PHP

In PHP, you can return a JSON response like this:

```php
<?php
http_response_code(400); // Bad Request
header('Content-Type: application/json'); // Send as JSON
exit(json_encode([
  'invalid': ['username', 'password'],
  'message': 'Invalid username or password'
]));
```
