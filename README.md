### Github User Search API

To run the API server, the following commands are used to build the docker image and to run it after cloning the repository

    $ cd github-user-search
    $ docker build -t github-user-search-api .
    $ docker run -it -p 3001:3000 --name githubusersearchapi github-user-search-api

Once the API server has started the following endpoint is available:

To get the top-100 users who use a particular programming language in their public repositories:

> curl -i "http://localhost:3001/api/search?language=python"

I return only the top-100 users per search due to rate-limitations of using the github search api which allows only 5000 requests per hour and for a particular search you can get upto 1000 results (through pagination).
