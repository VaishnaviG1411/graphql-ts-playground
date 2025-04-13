import { ApolloServer, gql } from 'apollo-server';
import { v4 as uuidv4 } from 'uuid';

// 📌 Book interface with Genre
interface Book {
  id: string;
  title: string;
  author: string;
  pages: number;
  genre: 'FICTION' | 'SELF_HELP' | 'SCI_FI' | 'FANTASY';
}

// 📚 Sample data
let books: Book[] = [
  { id: "1", title: '1984', author: 'George Orwell', pages: 328, genre: 'FICTION' },
  { id: "2", title: 'Atomic Habits', author: 'James Clear', pages: 320, genre: 'SELF_HELP' },
];

// 🧠 GraphQL Schema with enum, input type, and mutation
const typeDefs = gql`
  enum Genre {
    FICTION
    SELF_HELP
    SCI_FI
    FANTASY
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    pages: Int!
    genre: Genre!
  }

  input NewBookInput {
    title: String!
    author: String!
    pages: Int!
    genre: Genre!
  }

  type Query {
    books: [Book!]!
    bookById(id: ID!): Book
    booksByAuthor(author: String!): [Book!]!
  }

  type Mutation {
    addBook(input: NewBookInput!): Book!
  }
`;

// 🧠 Resolvers with Mutation and Validation
const resolvers = {
  Query: {
    books: (): Book[] => books,
    bookById: (_: unknown, args: { id: string }): Book | undefined =>
      books.find(book => book.id === args.id),
    booksByAuthor: (_: unknown, args: { author: string }): Book[] =>
      books.filter(book => book.author === args.author),
  },
  Mutation: {
    addBook: (_: unknown, args: { input: Omit<Book, 'id'> }): Book => {
      const { title, author, pages, genre } = args.input;

      // 🛑 Validation: All fields are required
      if (!title || !author || !pages || !genre) {
        throw new Error("All fields are required.");
      }

      // ❌ Check for duplicate
      const duplicate = books.find(
        b => b.title === title && b.author === author
      );
      if (duplicate) {
        throw new Error("Book already exists.");
      }

      // ✅ Create new book
      const newBook: Book = {
        id: uuidv4(),
        title,
        author,
        pages,
        genre
      };

      books.push(newBook);
      return newBook;
    }
  }
};

// 🚀 Start Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
