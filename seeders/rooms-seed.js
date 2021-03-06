// import model
const Namespace = require('../models/namespace')
const User = require('../models/user')
const Room = require('../models/room')

// import mongoose and connect to mongoDB
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/chatup', { useNewUrlParser: true })
const db = mongoose.connection

// import other libs
const uuid = require('uuid')
const uuidv4 = uuid.v4

// import seed file
const rooms = require('./seedfile/room')

// actions if connect error
db.on('err', (err) => {
  if (err) return console.error(err)
})

// actions if connect success
db.once('open', (err) => {
  if (err) return console.error(err)
  console.log('connect to mongoDB successifully !')

  return User.findOne({ email: 'user1@example.com' }, function (err, resUser) {
    if (err) return console.error(err)

    return Namespace.findOne({ name: 'Sport' }, function (err, resNsp) {
      const newRooms = rooms.map((item) => ({
        ...item,
        creatorId: resUser._id,
        users: [resUser._id],
        // namespaceId: resNspId[Math.floor(Math.random() * resNsp.length)]
        namespaceId: resNsp._id
      }))

      // // 以 array 寫入 collection
      return Room.insertMany(newRooms, (err, rooms) => {
        if (err) return console.log(err)

        console.log('insert to db successifully')
        return Namespace.findOne({ name: 'Sport' }, function (err, resNsp) {
          rooms.forEach(room => resNsp.rooms.push(room._id))

          resNsp.save()
          console.log('insert to db successifully')
        })
      })

    })
  })
})