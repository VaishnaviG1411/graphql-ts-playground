import { ApolloServer, gql } from 'apollo-server';

// 📌 TypeScript interface for Book
interface Book {
  id: string;
  title: string;
  author: string;
  pages: number;
}

// 📚 Updated Dummy Data
const books: Book[] = [
  { id: "1", title: '1984', author: 'George Orwell', pages: 328 },
  { id: "2", title: 'Atomic Habits', author: 'James Clear', pages: 320 },
  { id: "3", title: 'Animal Farm', author: 'George Orwell', pages: 144 }
];

// 🧠 Updated Schema
const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    pages: Int!
  }

  type Query {
    books: [Book!]!
    bookById(id: ID!): Book
    booksByAuthor(author: String!): [Book!]!
  }
`;

// 🧠 Updated Resolvers
const resolvers = {
  Query: {
    books: (): Book[] => books,
    bookById: (_: unknown, args: { id: string }): Book | undefined => {
      return books.find(book => book.id === args.id);
    },
    booksByAuthor: (_: unknown, args: { author: string }): Book[] => {
      return books.filter(book => book.author === args.author);
    }
  }
};

// 🚀 Start Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
