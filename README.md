# Todo list Project
## Introduction
This is a project made with react, graphql, django with postgres
## Installation
You must have docker and docker-compose installed once the project is cloned. You can install it from this page, click [Here](https://docs.docker.com/get-started/ "Here")
## Execution
Create the images with docker-compose
```bash
 $ cd todoapp
 $ docker-compose up -d
```

We enter the backend image
```bash
$ docker exec -it backend bash
$ python manage.py makemigrations
$ python manage.py migrate
```

Enter the browser and type
> *localhost:3000*
