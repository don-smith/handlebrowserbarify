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
  document.getElementById('widgets').innerHTML = widgetsHtml
}
