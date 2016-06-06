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
