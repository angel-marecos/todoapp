FROM python:3

ENV PYTHONUNBUFFERED=1


# Set the working directory to /code
RUN mkdir /code
WORKDIR /code

COPY requirements.txt /code/

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

COPY . /code/