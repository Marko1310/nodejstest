# Theory

In this part you need to concisely answer each question.

## General

- What libraries do you consider necessary for any application? Which ones do you use most commonly?</br>
  For any application I consider necessary using:

  1. validation library (I commonly use Zod)
  2. testing framework (I commonly use Jest)
  3. fetching library (I commonly use Axios)
  4. ORM (I commonly use TypeORM)
  5. Linting and code formatters (I commonly use Prettier and ESLint)

- How would you choose a backend? When would you use HTTP server, serverless functions or Websockets?</br>
  I would choose HTTP server for web application and RESTful APIs that don’t require real-time updates or instant interactions.
  Serverless functions are good for event-driven applications and scenarios with sporadic or variable workloads, and serverless architectures scale automatically based on demand.
  Websockets are used for bidirectional communication and are ideal for applications requiring real-time communication, such as chat applications.

- When starting a new project how would you choose between OOP and Functional Programming?</br>
  Dependiing on various factors, including team expertise, the nature of the project and scalability.
  OOP is well-suited for applications with rich relationships between entities and a focus on organizing code around objects that represent real-world entities. OOP is well-suited for applications where state management is a critical aspect.
  Functional Programming is well-suited when project involves complex data transformations, mathematical operations, and a focus on immutability. FP is well-suited for scenarios requiring predictable and testable code.

- What is middleware useful for?</br>
  Middleware allows to intercept and process incoming HTTP requests before they reach the application's route handlers. This is useful for performing tasks such as parsing request bodies, modifying headers, handling authentication and authorization checks or modification of the HTTP response before it is sent back to the client. Middleware can handle errors that occur during the request-response cycle. Middleware is often employed for logging purposes.

## TypeScript and NodeJS

- Explain what are prototypes and how does class inheritance make use of them?</br>
  Every object in JavaScript, including functions, arrays, and other objects, has a prototype, which serves as a blueprint for the object. Prototypes are part of the prototype chain, enabling inheritance and the sharing of properties and methods between objects. For example, Array.prototype is the prototype of all array objects we create in JS. Therefore, all arrays have access to the 'map' method for example. ES6 introduced the class syntax but it still relies on underlying prototype mechanisms. Class inheritance involves linking the prototype of a subclass to the prototype of its parent class.

- What is type narrowing and how does it work?</br>
  Type narrowing often involves the use of type guards, which are expressions that perform runtime checks on the types of values, like "typeof" or "instanceof". For example using "typeof" allows to narrow down the type based on the runtime type of a variable.

  ```bash
  function processString(input: string | number) {
  if (typeof input === 'string') {
    // Inside this block, TypeScript knows 'input' is a string
    console.log(input.toUpperCase());
  } else {
    // Here, TypeScript knows 'input' is a number
    console.log(input.toFixed(2));
    }
  }
  ```

- How does NodeJS provide asynchronism and concurrency?</br>
  Node.js utilizes an event-driven, non-blocking I/O model for asynchronism and concurrency. The event loop, at the core of Node.js, efficiently handles simultaneous connections by registering callbacks for asynchronous operations, avoiding blocking on I/O. Asynchronous operations in Node.js are typically managed using callback functions, but we've got options like Promises and async/await to keep our code structured and readable like sync code.

- What is a Promise?</br>
  A Promise in JavaScript is an object representing the eventual completion or failure of an asynchronous operation. It is used to handle asynchronous operations more conveniently and avoid the callback hell (nested callbacks) that can arise when dealing with multiple asynchronous tasks.

- What build tools would you use when deploying code to the cloud?</br>
  I would use AWS CodeBuild or GitHub Actions for the CI/CD pipeline and tools like aws-sdk and aws-cli for programmatic and command-line interaction with AWS services.

## AWS

- Name AWS services that can be used for asynchronous communication. What are the differences between them?</br>
  SQS focuses on message queuing where it acts as a temporary storage system for messages sent between distributed software components, SNS is centered around the publish/subscribe messaging pattern, and EventBridge on serverless event orchestration, providing a central event bus for handling events across various AWS services and custom applications.

- What tools do you use to monitor the application?</br>
  I would use Amazon CloudWatch. It supports monitoring EC2 instances, Lambda functions, RDS databases, and more.

- What are Secondary Indexes in DynamoDB useful for?</br>
  Secondary indexes are useful for enabling efficient querying and retrieval of data based on attributes other than the primary key. It is useful when we need to look up items based on specific attribute values without relying solely on the primary key. They enable efficient filtering and sorting of data based on non-key attributes and we can optimize the performance of queries.
  (For example: We are storing information about books. We have a secondary index on the "Author" attribute. We want to retrieve all books written by a certain author. Without a secondary index, we might need to scan the entire table, checking each item's "Author" attribute. However, with a secondary index on "Author," DynamoDB can efficiently locate all items associated with that author.)
