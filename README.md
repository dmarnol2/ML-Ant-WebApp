# ML-Ant-WebApp
A web server application that takes uploaded images and sends them to a Tensorflow Machine Learning model for identifying and classifying Ant genus.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to install npm, node.js, express.js

### Installing

A step by step series of examples that tell you have to get a development env running

First, you need to clone the repository.

```
https://github.com/dmarnol2/ML-Ant-WebApp.git
```

Then to launch change into the root directory and run the application.

```
..\workspace\> cd AntCLassifierWebApp
..\workspace\BrewSimDB\AntClassifierWebApp\> npm start
or alternatively to automatically restart server with each change:
..\workspace\AntClassifierWebApp\> nodemon app.js
```
If it won't launch because any dependencies aren't install, run the following command replacing 'dependency' with the name of the dependency you need to install.
```
..\workspace\AntClassifierWebApp\> npm install <dependency> --save
```

Finally, to access the app, open your browser and type:

```
localhost:8080
```

## Running the app

On the upload page, simply drag and drop an image into the box or click box to be taken to your file system. Explore tabs on navigation bar to learn more about the site.

## Built With

* [Node](https://nodejs.org/) - Web server used
* [Express](https://expressjs.com/) - Web framework used
* [Express-Handlebars](https://handlebarsjs.com/) - Templating Engine used
* [DropzoneJS](http://www.dropzonejs.com/) - File Uploader framework used
* [Bootstrap](https://getbootstrap.com/) - HTML styling used

## Contributing

This project is not open for contribution at this time.

## Versioning

Application is live at: 

## Authors

* **David Arnold**  - [dmarnol2](https://github.com/dmarnol2)
* **Aaron Hulseman**  - [ahulsem](https://github.com/ahulsem)
* **Sadai Sarmiento**  - [Heidern](https://github.com/Heidern)
* **Francisco Bencomo**  - [fbencomo](https://github.com/fbencomo)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
