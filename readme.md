# Bundling tutorial

This small tutorial illustrates how to use Browserify to prepare Handlebars templates during a build process for use in the browser. The existence of this tutorial should in no way indicate that this is a recommended way to build web experiences. This is only a small illustration of how Browserify can prepare browser-ready assets and how one might use Handlebars to perform client-side template rendering when data is being supplied by a web API.

## Steps

* `npm init`
* `npm install express superagent --save`
* `npm install browserify handlebars hbsfy --save-dev`
* `mkdir public src`
* Create a build script in `package.json`

  ```js
  "scripts": {
    "build": "browserify -t hbsfy src/index.js > public/bundle.js",
    "start": "node server.js"
  },
  ```

* Create `public/index.html`:

  ```js
  <html>
  <head>
    <title>Handlebrowserbarify</title>
  </head>
  <body>
    <h1>Widgets!</h1>
    <button id="widgetButton">Get widgets</button>

    <div id="widgets"></div>

    <script src="bundle.js"></script>
  <body>
  </html>
  ```

  The `<div id="widgets">` element is the placeholder for the rendered template.

* Create `src/widgets.hbs`

  ```xml
  {{#each widgets}}
    <div class="widget">
      <h3>{{name}}</h3>
      <p>Category: {{category}}</p>
      <p>Price: ${{price}}</p>
    </div>
  {{/each}}
  ```

  For this to work, the object we pass to the template must have a `widgets` property that is an array of widgets.

* Create `src/index.js`

  ```js
  var request = require('superagent')
  var widgetsTemplate = require('./widgets.hbs')

  document.addEventListener('DOMContentLoaded', registerButtonClickHandler)

  function registerButtonClickHandler () {
    var button = document.getElementById('widgetButton')
    button.addEventListener('click', function () {
      request
        .get('/widgets')
        .end(showWidgets)
    })
  }

  function showWidgets (err, res) {
    var viewModel = {widgets: res.body}
    var widgetsHtml = widgetsTemplate(viewModel)
    document.getElementById('widgets').innerHtml(widgetsHtml)
  })
  ```

  Because of the build script we included in `package.json`, `hbsfy` will compile `widgets.hbs` into a `widgetsTemplate` function we can render with the `viewModel`. As we can see in the next snippet, `res.body` will be an array of widgets.

* Create `server.js`

  ```js
  var express = require('express')

  var PORT = process.env.PORT || 3000
  var app = express()

  var widgets = [
    {
      name: 'widget name',
      category: 'widget category',
      price: 123.45
    }, {
      name: 'another widget',
      category: 'same widget category',
      price: 321.45
    }
  ]

  app.use(express.static('public'))

  app.get('/widgets', function (req, res) {
    res.json(widgets)
  })

  app.listen(PORT, function () {
    console.log('Listening on port', PORT)
  })
  ```

  This exposes a single `/widgets` API endpoint and sets up our `public` folder as a static folder so `index.html` and `bundle.js` can be requested.

* Build the assets with `npm run build`.

* Start the server with `npm start`.

* Navigate to http://localhost:3000 and click the button. If you open your browser's developer tools and use the network tab, you can see the API call when you click the button.

That's it. I hope this was helpful.
