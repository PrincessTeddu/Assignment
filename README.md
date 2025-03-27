# Assignment

The minimum required to run the application is that it has to be a letter-writing application. The technologies were React with Node.js for the frontend, and a backend with just React/Express/js. 

Good coding mostly equals separating concerns.

– Frontend (cliente):
  
  - React with typescript
  - Uses Draft.js for rich text editing
  - User interface must be Material-UI
  - Firebase Authentication
  - 
– Backend (servidor):
  
  - Express.js server
  - Storing letters in google drive API
  - Firebase Admin SDK for authentication
    
In several environments, however, things may have stopped the project from running:

1. PowerShell execution policy restriction
2. No config for environment variables
You will need to set up this environment and change the PowerShell settings for the project to run.

After that application will be available on the link http://locahost:5173.


I've looked through both server and client configuration files and found out what error it is. Everything was properly configured on his PowerShell; the server just blatantly got restricted by execution policy. I have killed a number of server instances with duplicate configurations that were running in conflict and tried to start it again with proper configuration. I believe the crux of the problem is that my Node has some confusion going on regarding module resolution and needs some clarification here. Both Firebase and Google OAuth are in their respective environment variables (client and server). To actually solve the problem, you would have to run the server in administrator mode or change PowerShell execution policy to allow scripts to be run.


# link
This is the basic sturcture i created before working on this project

https://www.loom.com/share/6cab2a21c0114a5381f593bc3b2e4372
