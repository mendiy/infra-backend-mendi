import { connectToDatabase } from './dbConnect.js'
import { insertTodoTask } from '../action/todoFunctions.js';

connectToDatabase();


// Usage examples:
insertTodoTask("content");
