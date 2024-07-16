const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const db = require('../lib/db.js');
// Import the web-push library for working with push notifications
const webPush = require('web-push');

const publicKey = process.env.REACT_APP_PUBLIC_VAPID_KEY;
const privateKey = process.env.REACT_APP_PRIVATE_VAPID_KEY;

webPush.setVapidDetails(
  "mailto:test@test.com",
  publicKey,
  privateKey
);

// Initialize an object to store subscriptions
let subscriptions = {}

// Route for subscribing to push notifications
router.post('/subscribe', (req, res) => {
    // Extract subscription and ID from the request
    const {subscription, id} = req.body;
    // Store the subscription in the object under the key ID
    subscriptions[id] = subscription;
    // Return a successful status
    return res.status(201).json({data: {success: true}});
});

// Route for sending push notifications
router.post('/send', (req, res) => {
    // Extract message, title, and ID from the request
    const {message, title, id} = req.body;
    // Find the subscription by ID
    const subscription = subscriptions[id];
    // Create the payload for the push notification
    const payload = JSON.stringify({ title, message });

    // Send the push notification
    webPush.sendNotification(subscription, payload)
    .catch(error => {
        // Return a 400 status in case of an error
        return res.status(400).json({data: {success: false}});
    })
    .then((value) => {
        // Return a 201 status in case of successful sending
        return res.status(201).json({data: {success: true}});
    });
});

module.exports = router