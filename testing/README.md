[<- BACK](../README.md)

# testing/

## Backend

Backend testing uses [Postman](https://www.postman.com/downloads/) to check various API functionalities. Inside the backend testing folder is a JSON file which is a Postman collection that can be imported from the UI. If you make any changes, don't forget to export it back to the repo here. Newman is a command line tool which can be used to just run the test collection, you don't need to install anything to do this, just run `make test-backend` and you'll get a test summary when it's done. Note that the dev environment must already be up.
