# Pattern Web
Webapp for pattern experiments.

## Prerequisites
You will need a [Heroku](https://www.heroku.com/) account and the
[Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) to run this application.
Heroku has a [free tier](https://www.heroku.com/free).
It is recommended that you follow [Heroku's guide](https://devcenter.heroku.com/articles/getting-started-with-python)
to getting started with Python before running this application.

You will also need a [MongoDB](https://www.mongodb.com/) database to run this application.
You can get a free MongoDB database by signing up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
MongoDB Atlas has a free tier which includes a simple cluster deployment.

This README assumes you are running on Linux.

You will need a [Python 3](https://www.python.org/about/) interpreter to run this application.
The Python 3 interpreter should include the `venv` module.

## Setup

### Python
You will need to create a virtual environment to run this application.
Run the following commands at the root of this repo:
```
python3.9 -m venv venv
source venv/bin/activate
pip install -Ur requirements.txt
```

Tell Heroku that you want this repo to be an application:
```
heroku create pattern-web
```

### SSL
To preserve consistency with running in the cloud, this application uses HTTPS even when running locally.
You will need to run the following commands from the root of the repo to get ready for HTTPS:
```
mkdir ssl
cd ssl
openssl req -nodes -new -x509 -keyout server.key -out server.crt \
    -subj "/C=GB/ST=London/L=London/O=Local/OU=Local/CN=127.0.0.1"
```
The `ssl` folder is ignored by `git` so you should not need to worry about committing the
generated key and certificate.

After generating the key and certificate, you are ready to run the application.

### Environment Variables
To run this application, you need to set some environment variables:
* `MONGO_USER` - The username for the MongoDB connection
* `MONGO_PASSWORD` - The password for the MongoDB connection
* `MONGO_HOST` - The host to connect to for the MongoDB connection

## Running the application

### Local
Your run configuration should look like the following:
```
venv/bin/gunicorn \
    --certfile=ssl/server.crt \
    --keyfile=ssl/server.key \
    --worker-class eventlet \
    -w 1 \
    "application:create_flask_app()"
```
Make sure to run the application with the working directory set at the root of the repo.

The webapp should be accessible at [https://127.0.0.1:8000]()

You will most likely need to tell your browser to accept the self-signed certificate.

### Heroku Local
After setting up the environment variables, you can run the application locally.
Be sure you have activated the virtual environment before running this command:
```
heroku local
```

You should then be able to access the application at [https://0.0.0.0:5000](https://0.0.0.0:5000)
in your browser.

You will most likely need to tell your browser to accept the self-signed certificate.

### Heroku Cloud
Once you have verified that the application works locally, you can deploy to Heroku:
```
git push heroku master
```

Once the deploy succeeds you can spin up a web dynamo to serve requests:
```
heroku ps:scale web=1
```

You can use the following command to open the Heroku deployment in your browser:
```
heroku open
```

## Tests
You can use [tox](https://tox.readthedocs.io/en/latest/) to run the tests in this repo.

First, install tox in the virtual environment:
```
pip install tox
```

Next, simply run `tox` in the root of the repo.
In addition to running the unit tests, code linting and formatting will be performed using
[black](https://github.com/psf/black), and [flake8](https://flake8.pycqa.org/en/latest/).

## Database
This application creates a database called `test`.
It also creates a collection in that database called `test_collection`.

This application creates a TTL index on `test_collection` so documents created by this application will be
deleted after some time.
