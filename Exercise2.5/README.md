## Detailed description of App.jsx file:

- App.jsx file represents the main component of the application. This file displays courses and their information using a component called 'Course'.

- `import React from 'react';` :Imports the React library into the application.

- `import Course from './Course';` : Imports the 'Course' component from the file named 'Course'.

- `const App = () => {` : Defines a function component named 'App'.

- `const courses = [` : Defines a constant named 'courses'. This constant contains an array containing details of the courses and their parts.

- `{ name: 'Half Stack application development', id: 1, parts: [` : Defines the first course. Lists the parts of this course under the keyword 'parts'.

- `{ name: 'Fundamentals of React', exercises: 10, id: 1 },`: Specifies the name of the first section, the number of exercises in this section and the section ID.

- `]` : Closes the list of chapters of the first course.

- `},` : Closes the first course.

- `{ name: 'Node.js', id: 2, parts: [` : Defines the second course. Lists the parts of this course under the keyword 'parts'.

- `{ name: 'Routing', exercises: 3, id: 1 },`: Specifies the name of the first section, the number of exercises in this section and the section ID.

- `];` : Closes the list of courses.

- `return ( ` : Initializes the JSX (JavaScript XML) portion of the function component. JSX is a syntax used to define React components.

- `<div>` : Opens a 'div' element. This 'div' is the main container of the application.

- `{courses.map(course => (` : Loops the array 'courses' and renders the 'Course' component for each course. The 'map' function runs a function for each element in the array and returns a new array.

- `<Course key={course.id} course={course} />` : Render the 'Course' component for each course. The 'key' prop is used for React to uniquely identify each element. The 'course' prop passes the relevant course data to the 'Course' component.

- `))` : Closing parenthesis of the 'map' function.

- `</div>` : Closes the 'div' element.

- `);` : Closes the 'return' statement.

- `}` : Closes the 'App' function component.

- `export default App;` : Exports the 'App' component by default so it can be used in other files.

## Detailed description of Course.jsx

- Course.jsx file is a React component that displays the title, content, and total number of exercises of a course. This component displays course details using three subcomponents ('Header', 'Content', 'Total').

- `const Course = ({ course }) => {` : Defines a function component named 'Course'. This component takes a 'course' object as props and displays the details of the course using this object.

`const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0);` : Defines a constant named 'totalExercises'. This constant calculates the total number of exercises across all sections of the course. The 'reduce' function runs a function for each element in the array, returning a single value. In this example, the initial value of 'sum' is set to 0 and each 'part.exercises' value is summed with this 'sum' to obtain the total number of exercises.

`<Header course={course.name} />` : Render the 'Header' component and pass the course name ('course.name') as the 'course' prop. This is used to display the title of the course.

`<Content parts={course.parts} />` : Renderes the 'Content' component and passes the sections of the course ('course.parts') as the 'parts' prop. This is used to show the sections of the course and the number of exercises in each section.

**NOTE**: I explained some simple codes once. In other words, sometimes I did not explain a code structure that I explained in the App.jsx file in subsequent files.

## Other files and important codes

- `{parts.map(part => (` :Loops the array 'parts' and renders a 'p' element for each part. The 'map' function runs a function for each element in the array and returns a new array .

- `<p key={part.id}>`: Opens a 'p' element for each section and gives the ID of the section as the 'key' prop. This is used for React to uniquely identify each element. 

- main.jsx file is the startup file of the React application and renders the root component of the application ('App') to the DOM

- `import ReactDOM from 'react-dom/client';` :Imports the 'client' module of the ReactDOM library into the application. ReactDOM is used to render React components to DOM.

- `ReactDOM.createRoot(document.getElementById('root')).render(<App />);` : Finds the DOM element with the ID 'root' and creates this element as the root element of the React application. It then renders the 'App' component to this root element.

- vite.config.js file is the configuration file for Vite.

- `import { defineConfig } from 'vite'` : Imports the 'defineConfig' function from the Vite library. This function is used to define the Vite configuration.

- `import react from '@vitejs/plugin-react'` : Imports the React plugin for Vite. This plugin is used to develop React projects with Vite.

- `export default defineConfig({` : Defines the Vite configuration file and exports it by default.

- `plugins: [react()],` : Adds the React plugin to the Vite configuration. This allows Vite to support React projects.

- index.html file is the base HTML file of the application. This file determines how the application is displayed in the browser. Now let's explain the contents of this file line by line:

- `<!doctype html>` : Specifies the HTML5 doctype declaration. This tells the browser that the page will use the HTML5 standard.

- `<html lang="en">` : Sets the language of the HTML document to English.

- `<head>` : Opens the header section of the HTML document. This section contains meta information, style files, and other header information.

- `<meta charset="UTF-8" />` : Sets the character set of the document to UTF-8. This ensures that the characters used in the document are displayed correctly.

- `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` : Sets the viewing area of ​​the page. This meta tag ensures that the page displays properly on mobile devices.

- `<title>Fullstack</title>` : Sets the title of the document. This title is displayed in the browser tab.

`<body>` : Opens the body section of the HTML document. This section contains the content part of the page.

- `<div id="root"></div>` : Creates a 'div' element with ID 'root'. This 'div' will be used as the root element of the React application.

- `<script type="module" src="/src/main.jsx"></script>` : Imports the file 'main.jsx' as a module. This is the starting point of the application and starts the React application. 

