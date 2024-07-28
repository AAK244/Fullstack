[fullstack3](https://fullstack3-0d4x.onrender.com)

**NOTE** : The web page's communication with the database (MongoDB) is active. You can add, delete and update people to the Phonebook Application. After the update, it is necessary to refresh the page to see that the phone number has changed. Render starts quickly when first opened, but the page opens very slowly when refreshed.

How it works: I created a .env file locally and added it to .gitignore. The content of the .env file (does not belong to me):
```
MONGODB_USERNAME=ANNA45
MONGODB_PASSWORD=e9RHYKeu7FPWZsiQ
MONGODB_CLUSTER=anna.k6ponht.mongodb.net
MONGODB_DBNAME=phonebook
```
Then we add the IP addresses used by Render to MongoDB. We add the user information in the .env file to the Environment field in Render. In this way, we enable our application to work with the database without having our MongoDB user information in the mongo.js file.
