
import mongoose from "mongoose"


export const connectDB = async () => {
    //var mongoString = "mongodb://username:password@mongo-mongodb.mongo.svc:27017/licenta"
    var mongoString = "mongodb://username:password@localhost:27017/licenta"
    console.log('connection string:', mongoString);
    await mongoose.connect(mongoString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      console.log('connected to database')
    }, (error) => {
      console.log(`mongodb connection Error ${error}`);
    })
  }
  

  