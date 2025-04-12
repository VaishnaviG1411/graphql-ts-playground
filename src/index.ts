import { ApolloServer, gql } from 'apollo-server';

// 📌 TypeScript interface for Book
interface Book {
  title: string;
  author: string;
  pages: number;
}

// 📚 Sample data using the type
const books: Book[] = [
  { title: '1984', author: 'George Orwell', pages: 328 },
  { title: 'Atomic Habits', author: 'James Clear', pages: 320 }
];

// 🧠 Define GraphQL schema
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

// 🧠 Define resolver types using TS
const resolvers = {
  Query: {
    books: (): Book[] => books
  }
};

// 🚀 Start Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
