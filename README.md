# ML-Ant-WebApp
A web and server application that takes uploaded images and sends them to a Tensorflow Machine Learning model for identifying and classifying Ant genus.

This project is a data science project that aims to develop a system to automatically identify insect specimens. This system would primarily help researchers studying biodiversity, behavior, and ecology of ants but also provide means to support amateur entomologists in the field as well as to generalize to other insect species. 

The biological classification system and identification of animal and plant taxa are necessary for any research project involving living organisms. Unfortunately, the task of identification of many species or higher taxa (such as genera or families) requires considerable expertise developed over years of taxonomic research. This is especially true for hyper-diverse groups of organisms, such as insects. The shrinking number of active insect taxonomists and their limited time resources leave many biologists to try and identify their samples on their own, instead of consulting experts. This is usually done using so-called dichotomous keys, which are often cumbersome and challenging to use for non-experts. As a result, the correct identification of study organisms is often difficult. An alternative approach, only recently available due to large amount of digitized biodiversity data and developments in neural network model applications, is using deep learning for automated classification of images of animals and plants. Well-performing tools for automated identification of biological species from images will constitute a significant development in life sciences and allow more effective conservation efforts. This system will be useful for documenting and digitizing natural history specimens from museum collections around the world and will help foster citizen science by empowering amateur naturalists to identify insects in the field. 

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
