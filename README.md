# mongo db start
``` mongod --dbpath mongo-data ```

#heroku
> heroku create
> heroku addons:create mongolab:sandbox

heroku config
> will give us the mondodb uri.

#push code to heroku master
> git push heroku master

#heroku logging
> heroku logs

#to go heroku root of app
> heroku open

# add heroku app
> heroku git:remote -a evening-thicket-55605

# model methods vs instance methods
> Model methods are with upper case User
> model method does not require access to a document.
``` So a model method like User.findBytoken. we will make this method```
> Instance methods are on the lower case user instance.
> u require the individual user document. U need access to the individual document
``` user.generateAuthToken ```

