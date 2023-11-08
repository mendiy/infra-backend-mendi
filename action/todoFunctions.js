import  { TodoTask } from '../db/todoSchema.js';

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 1000; // 1 second

// Function to insert a new ToDo task
async function insertTodoTask(content) {
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        const newTask = new TodoTask({ content });
        const savedTask = await newTask.save();
        console.log(`${savedTask._id} document inserted.`);

        return savedTask;
      }  catch (e) {
        if (e.message.includes('buffering timed out')) {
          console.warn(`Insertion attempt ${retries + 1} timed out. Retrying...`);
          retries++;
          await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
        } else {
          console.error('Error while inserting user:', e);
          throw new Error('User insertion failed.');
        }
      }
    }
    console.error(`User insertion failed after ${MAX_RETRIES} retries.`);
    throw new Error('User insertion failed.');
  }
  
  // Export the function for external use
  export { insertTodoTask };