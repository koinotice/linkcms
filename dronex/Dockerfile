
ARG PYTHON_VERSION=3.7

FROM python:${PYTHON_VERSION}

RUN mkdir /src
WORKDIR /src

COPY requirements.txt /src/requirements.txt
RUN pip install -r requirements.txt
COPY . /src/
# COPY test-requirements.txt /src/test-requirements.txt
# RUN pip install -r test-requirements.txt
CMD python etf.py

 