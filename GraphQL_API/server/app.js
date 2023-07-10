const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema'); // Assuming the schema.js file is in the same directory

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema, // Include the schema in the options object
  graphiql: true, // Set graphiql to true if you want to enable the GraphiQL interface
}));

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
