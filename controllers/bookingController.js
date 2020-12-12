//Import models
const { Tenant } = require('../models/tenant')
const { Host } = require('../models/host')
const { Booking } = require('../models/booking')

const { ObjectId } = require('mongodb');

//Database connection
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://reillyem11:12345@cluster0.nmzpa.gcp.mongodb.net/RentalDB?retryWrites=true&w=majority";

/*
module.exports.schedule_get= (req,res,) => {
    res.render('schedule_bookings', { page: "Schedule Booking" });
}
*/


module.exports.booking_listing_get = async (req, res, next) => {
  var listing_id = req.params.listing_id;
  MongoClient.connect(url, async function (err, dbs) {
    if (err) throw err;
    const dbo = dbs.db("RentalDB");
    var listing = await dbo.collection("Listing").findOne({ "id": listing_id });
    var host_id = listing.host_id;
    var price = listing.price;
    dbs.close();
    res.render('booking_schedule', { page: "Schedule Booking", listing: listing });
  })
}

/*module.exports.bookings_get= (req,res,next) => {
    res.render('bookings', { page: "Booking Lists" });
    req.collection.find({})
    .toArray()//move them into an array
    .then(results => res.json(results))
    .catch(error => res.send(error));//catch any erros 
}
*/

module.exports.booking_post = async (req, res, next) => {
  
  try {
      MongoClient.connect(url, async function (err, dbs) {
        if (err) throw err;
        const dbo = dbs.db("RentalDB");
        var listing = await dbo.collection("Listing").findOne({ "id": req.params.listing_id });
        var host_id = listing.host_id;
        var price = listing.price;

        const { listing_id, tenant_id, schedule_date, date_start, date_end } = req.body;

        if (!date_start) {
          res.status(400).json({ message: "Start date is required." });

        }  else if (!date_end) {
          res.status(400).json({ message: "End date is required. "});

        } else {

          //Validate Available Booking
          console.log("listing_id: " + req.params.listing_id);
          var overBooked = await dbo.collection("Booking").find({ 
            "listing_id": req.params.listing_id
          }, {
            $or: [{ "date_start": { $gte: date_start, $lt: date_end }}, { "date_end": { $gt: date_start, $lte: date_end }}]
          });
          console.log("Overbooked: " + overBooked);

          if (overBooked.booking_id) {
            res.status(400).json({ message: "Not available for that timeframe." });
          } else {
            const booking = await Booking.create({
              _id: new ObjectId(),
              booking_id: new ObjectId(),
              listing_id: req.params.listing_id,
              host_id: host_id,
              tenant_id: tenant_id,
              schedule_date: schedule_date,
              date_start: date_start,
              date_end: date_end,
              price: price
            });
            console.log(booking);
            res.status(200).json({ booking: booking, message: "Booking successfully scheduled." });
          }
        }
      })
    
  } catch (err) {
      //const errors = handleErrors(err);
      console.log(err);
      res.status(400).json({ err });
  }
  /*

  MongoClient.connect(url, async function (err, dbs) {
    if (err) throw err;
    const dbo = dbs.db("RentalDB");
    var listing = await dbo.collection("Listing").findOne({ "id": req.params.listing_id });
    var host_id = listing.host_id;
    var price = listing.price;
    var booking_id = new ObjectId();

    const { listing_id, tenant_id, schedule_date, date_start, date_end } = req.body;
    console.log("req body: " + req.body);
    if (!date_start) {
      res.status(400).json({ message: "Start date is required." });
    }
    else if (!date_end) {
      res.status(400).json({ message: "End date is required." });
    } else {
        const payload = { booking_id, listing_id, host_id, tenant_id, schedule_date, date_start, date_end, price };
        await dbo.collection("Booking").insertOne(payload)
        .then(result => {
          res.json(result.ops[0])
          res.status(200).json({ message: "Booking successfully scheduled." });
        })
        .catch(error => res.send(error));   
    }
  }) */
}


/*
module.exports.booking_post= (req,res,next) =>{
    const { bookingDate, name, email } = req.body;
  if (!bookingDate || !name || !email) {
    return res.status(400).json({
      message: 'Booking Date, Name and email are required',
    });
  }
  const payload = { bookingDate, name, email };
  req.collection.insertOne(payload)
    .then(result => res.json(result.ops[0]))
    .catch(error => res.send(error));
}*/

module.exports.booking_delete= (req,res,next) =>{
    const { id } = req.params;
  const _id = ObjectID(id);
  req.collection.deleteOne({ _id })
    .then(result => res.json(result))
    .catch(error => res.send(error));
}
