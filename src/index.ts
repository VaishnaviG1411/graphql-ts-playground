import { ApolloServer, gql } from 'apollo-server';

// Types
const typeDefs = gql`
  type Book {
    title: String
    author: String
    pages: Int
  }

  type Query {
    books: [Book]
  }
`;

// Dummy data
const books = [
  { title: '1984', author: 'George Orwell', pages: 328 },
  { title: 'Atomic Habits', author: 'James Clear', pages: 320 }
];

// Resolvers
const resolvers = {
  Query: {
    books: () => books
  }
};

// Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
