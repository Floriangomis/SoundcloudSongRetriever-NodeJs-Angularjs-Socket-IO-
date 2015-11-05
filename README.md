# Soundcloud Retriever - NodeJs / Angularjs / Socket-IO #

### What's that ? ###

This repository is one application i made to manipulate Nodejs and AngularJs.

What it does is pretty simple : 

The backend allow you to retrieve all the song you liked or reposted on your Soundcloud account. 
In the same time since any files are hosted on my server the back-end is in charge to keep valid
mp3 files and to update all client connected on the web site through socket-io.

The front-end is a simple SAP which use Angularjs.

### Installation ###

Open your terminal then type : 
`sudo npm install`

Once it done, You should open `/helper/config.js` and put informations about your soundcloud application account.

Before to launch the project you should use `grunt` in your terminal. This will concat all Js files into a single one and will launch a JShint check.

Then you can launch the application by simply type `nodemon server.js` in your terminal.
