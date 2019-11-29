const app = require('./app');

app.listen(app.get('port'), () => {
  console.log('Node api is running on port', app.get('port'));
});
