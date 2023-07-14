const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema, 
  graphiql: true 
}));

app.listen(4000, () => {
  console.log('Server running on port 4000');
});

const connectionString = 'mongodb+srv://Sarah:YmAewJcKBagm2ky0@cluster0.gvom3z3.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('connected to database');
});
