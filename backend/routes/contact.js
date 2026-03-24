const express = require('express');
const router = express.Router();
const { sendFeedbackEmail } = require('../utils/sendEmail');

// @route   POST api/contact/send
// @desc    Send contact form feedback email to admins
// @access  Public
router.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide all fields (name, email, message).' });
  }

  try {
    const success = await sendFeedbackEmail(name, email, message);
    
    if (success) {
      return res.status(200).json({ message: 'Your message has been sent successfully. Thank you for your feedback!' });
    } else {
      return res.status(500).json({ message: 'Failed to send your message. Please try again later.' });
    }
  } catch (error) {
    console.error('Contact route error:', error.message);
    res.status(500).json({ 
      message: 'Server error while sending message.',
      debug: error.message 
    });
  }
});

module.exports = router;
