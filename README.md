# mongo db start
1. mongod --dbpath mongo-data

#heroku
heroku create
heroku addons:create mongolab:sandbox

heroku config
will give us the mondodb uri.

#push code to heroku master
git push heroku master

#heroku logging
heroku logs

#to go heroku root of app
heroku open

