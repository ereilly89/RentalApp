
//Import models
const { Tenant } = require('../models/tenant')
const { Host } = require('../models/host')
const { Booking } = require('../models/booking');
const { Listing } = require('../models/listing');

//Database connection
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://reillyem11:12345@cluster0.nmzpa.gcp.mongodb.net/RentalDB?retryWrites=true&w=majority";


// GET "profile/tenant/:tenant_id"

module.exports.profile_tenant_get = (req, res) => {
    var tenant_id = Number(req.params.tenant_id);
   Tenant.findOne({"tenant_id" : req.params.tenant_id})
   .then(data => {
     console.log(data);
     if (!data)
       res.render('profile_tenant', { tenant: null, page: 'Error', message: "Tenant profile not found."});
     else res.render('profile_tenant', { tenant: data, page: 'Tenant Profile'});
   })
   .catch(err => {
     res.render('profile_tenant', { tenant: null, page: 'Error', message: "Error retrieving profile with id=" + id});
     console.log("err:"+err);
   });
}


// GET "profile/host/:host_id"

module.exports.profile_host_get = (req, res) => {
  Host.findOne({"host_id" : req.params.host_id})
  .then(data => {
    console.log(data);
    if (!data)
      res.render('profile_host', {host: null, page: 'Error', message: "Host profile not found."});
    else res.render('profile_host', {host: data, page: 'Host Profile'});
  })
  .catch(err => {
    res.render('profile_host', {host: null, page: 'Error', message: "Error retrieving profile with id=" + id});
    console.log("err:"+err);
  });
}


// GET "profile/host/:host_id/listings"

module.exports.profile_host_listings_get = (req, res) => {
  
  MongoClient.connect(url, function(err, dbs) {
    if (err) throw err;
    const dbo = dbs.db("RentalDB");

	  // Obtain a list of rental listings
    const listingResource = dbo.collection("Listing").find({ "host_id": req.params.host_id });

    // Return all rental listings
  	listingResource.toArray( (err, rentalList) => {
        if (err) throw err;
    		console.log(rentalList);
        res.render("profile_host_listings", { page: "My Listings", listingArray: rentalList });
    		dbs.close();
    });
  });
}


// GET "profile/tenant/:tenant_id/bookings"

module.exports.profile_tenant_bookings_get = async (req, res) => {
  
  MongoClient.connect(url, function(err, dbs) {
    if (err) throw err;
    const dbo = dbs.db("RentalDB");
    var today = new Date();
    
	  // Obtain a list of rental listings
    const bookingResource = dbo.collection("Booking").find({ $and: [{ "tenant_id": req.params.tenant_id }, { "date_end": { $gt: today } }]}).sort({ "date_start": 1 });

    // Return all rental listings
  	bookingResource.toArray( (err, bookingList) => {
        if (err) throw err;
    		console.log(bookingList);
        res.render("profile_tenant_bookings", { page: "My Bookings", bookingArray: bookingList });
    		dbs.close();
    });
  });

}


// GET "profile/host/:host_id/bookings"

module.exports.profile_host_bookings_get = (req, res) => {
  MongoClient.connect(url, function(err, dbs) {
    if (err) throw err;
    const dbo = dbs.db("RentalDB");
    var today = new Date();

	  // Obtain a list of rental listings
    const bookingResource = dbo.collection("Booking").find({ $and: [{ "host_id": req.params.host_id }, { "date_end": { $gt: today } }]}).sort({ "date_start": 1 });

    // Return all rental listings
  	bookingResource.toArray( (err, bookingList) => {
        if (err) throw err;
        res.render("profile_host_bookings", { page: "My Bookings", bookingArray: bookingList });
    		dbs.close();
    });
  });
}


// GET "profile/tenant/:tenant_id/booking/:booking_id"

module.exports.profile_tenant_booking_get = async (req, res) => {

  var booking_id = req.params.booking_id;
  MongoClient.connect(url, async function(err, dbs) {
    const dbo = dbs.db("RentalDB");
    var booking = await Booking.findOne({ booking_id: req.params.booking_id });
    dbs.close();
    res.render('booking_details_tenant', { theBooking: booking, page: 'Booking' }); 
  });
}


// GET "profile/host/:host_id/booking/:booking_id"

module.exports.profile_host_booking_get = async (req, res) => {
  var booking_id = req.params.booking_id;
  MongoClient.connect(url, async function(err, dbs) {
    const dbo = dbs.db("RentalDB");
    var booking = await Booking.findOne({ "booking_id": req.params.booking_id });
    dbs.close();
    res.render('booking_details_host', { theBooking: booking, page: 'Booking' }); 
  });
}


// GET "profile/tenenant/:tenant_id/booking-history"

module.exports.profile_tenant_bookingHistory_get = (req, res) => {
  MongoClient.connect(url, function(err, dbs) {
    if (err) throw err;
    const dbo = dbs.db("RentalDB");
    var today = new Date();

    // Obtain a list of rental listings
    const bookingResource = dbo.collection("Booking").find({ $and: [{ "tenant_id": req.params.tenant_id }, { "date_end": { $lt: today } }]}).sort({ "date_start": -1 });
  
    // Return all rental listings
    bookingResource.toArray( (err, bookingList) => {
        if (err) throw err;
        res.render("profile_tenant_booking_history", { page: "My Booking History", bookingArray: bookingList });
        dbs.close();
    });
  });
}


// GET "profile/host/:host_id/booking-history"

module.exports.profile_host_bookingHistory_get = (req, res) => {
  MongoClient.connect(url, function(err, dbs) {
    if (err) throw err;
    const dbo = dbs.db("RentalDB");
    var today = new Date();

    const bookingResource = dbo.collection("Booking").find({ $and: [{ "host_id": req.params.host_id }, { "date_end": { $lt: today } }]}).sort({ "date_start": -1 });
  
    // Return all rental listings
    bookingResource.toArray( (err, bookingList) => {
        if (err) throw err;
        res.render("profile_host_booking_history", { page: "My Booking History", bookingArray: bookingList });
        dbs.close();
    });
  });
}
