# Prelimenary Doc for the Frontend

## Description
- The documentation aims at simplifying the usage of the frontend technologies currently adopted by the team to cater for modular programming in other to introduce scalability into the team's workflow.

## Structure
- `frontend/index.html`: Holds the static ui updating elements of the user facing part of the application.
- `frontend/canvas.js`: Holds the logic, which as at now combines the ui drawing and game logic. Further refactoring is required to seperate this two dynamic parts of the application. NOTE: I needed a refresial on nodejs import and export to be able to refactor the code further, which as at now is on progress

## Additional dependencies:
    ```sh
    npm install http-server
    ```
    
##  Running the Application:
The application can now be succintly serve by the nodejs server with these command as set up in the package.json currrently exclusive to my branch "ugoMusk":

- ```npm run start```: running this command is equivalent to "node backend/index.js" from the root of the repository. This would ensure the nodejs is started and exposes the application via localhost on port 3000.
- ```http://localhost:3000```: if everything went well, the application should be live in your browser.