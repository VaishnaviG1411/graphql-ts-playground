import { ApolloServer, gql } from 'apollo-server';
import { v4 as uuidv4 } from 'uuid';

// 📌 Book interface with Genre and Status enums
interface Book {
  id: string;
  title: string;
  author: string;
  pages: number;
  genre: 'FICTION' | 'SELF_HELP' | 'SCI_FI' | 'FANTASY';
  status: 'AVAILABLE' | 'CHECKED_OUT';
}

// 📚 Sample data with status field
let books: Book[] = [
  {
    id: "1",
    title: '1984',
    author: 'George Orwell',
    pages: 328,
    genre: 'FICTION',
    status: 'AVAILABLE'
  },
  {
    id: "2",
    title: 'Atomic Habits',
    author: 'James Clear',
    pages: 320,
    genre: 'SELF_HELP',
    status: 'CHECKED_OUT'
  }
];

// 🧠 Schema with two enums + mutation input
const typeDefs = gql`
  enum Genre {
    FICTION
    SELF_HELP
    SCI_FI
    FANTASY
  }

  enum BookStatus {
    AVAILABLE
    CHECKED_OUT
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    pages: Int!
    genre: Genre!
    status: BookStatus!
  }

  input NewBookInput {
    title: String!
    author: String!
    pages: Int!
    genre: Genre!
    status: BookStatus!
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

// 🧠 Resolvers with validation and new status field
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
      const { title, author, pages, genre, status } = args.input;

      if (!title || !author || !pages || !genre || !status) {
        throw new Error("All fields are required.");
      }

      const duplicate = books.find(
        b => b.title === title && b.author === author
      );
      if (duplicate) {
        throw new Error("Book already exists.");
      }

      const newBook: Book = {
        id: uuidv4(),
        title,
        author,
        pages,
        genre,
        status
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
