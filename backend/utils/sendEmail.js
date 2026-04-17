const nodemailer = require('nodemailer');

const sendOrderConfirmationEmail = async (order) => {
  try {
    // Check if email credentials are provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('EMAIL_USER or EMAIL_PASS not set in environment. Skipping order confirmation email.');
      return false;
    }

    // Configure the transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Formatting date and time for the email
    const istNow = new Date(order.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const orderDate = new Date(istNow);
    const dateStr = orderDate.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
    const timeStr = orderDate.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const customerName = order.user?.name || 'Customer';
    const customerEmail = order.user?.email;
    
    if (!customerEmail) {
      console.warn(`Order ${order.orderId} has no associated user email. Skipping email sending.`);
      return false;
    }

    // Build Items List HTML
    let itemsHtml = '';
    order.items.forEach(item => {
      const addOnsTotal = item.customizationData?.addOns?.reduce((sum, addon) => sum + Number(addon.price || 0), 0) || 0;
      const basePrice = Number(item.price) - addOnsTotal;
      
      let addOnsHtml = '';
      if (item.customizationData?.addOns?.length > 0) {
        addOnsHtml = `<br><span style="font-size: 12px; color: #777;">+ Add-ons: ${item.customizationData.addOns.map(a => `${a.name} (₹${a.price})`).join(', ')}</span>`;
      }
      
      itemsHtml += `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <strong>${item.name}</strong>
            ${addOnsHtml}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
        </tr>
      `;
    });

    // Address construction
    const addr = order.address || {};
    const fullAddress = [addr.fullAddress, addr.area, addr.city, addr.pincode].filter(Boolean).join(', ');

    // HTML Email Template matching the CSK Food Truck dark/yellow theme
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: #0b0b0e; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #FACC15; margin: 0;">CSK Food Truck</h1>
          <p style="color: #aaa; margin: 5px 0 0 0;">Chicken Shawarma & Kebab</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #333; text-align: center; margin-top: 0;">Your order has been placed successfully! 🎉</h2>
          <p style="color: #555; font-size: 16px;">Hello <strong>${customerName}</strong>,</p>
          <p style="color: #555; font-size: 16px;">Thank you for ordering with us. We've received your order and are preparing it right now!</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #FACC15;">
            <p style="margin: 0; color: #28a745; font-weight: bold;">✓ Payment Status: Success (${order.paymentMethod.toUpperCase()})</p>
            <p style="margin: 8px 0 0 0; color: #333;"><strong>Order ID:</strong> ${order.orderId}</p>
            <p style="margin: 4px 0 0 0; color: #333;"><strong>Date & Time:</strong> ${dateStr} at ${timeStr}</p>
          </div>

          <h3 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 8px;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                <th style="padding: 10px; border-bottom: 2px solid #eee; text-align: left; color: #666;">Item</th>
                <th style="padding: 10px; border-bottom: 2px solid #eee; text-align: center; color: #666;">Qty</th>
                <th style="padding: 10px; border-bottom: 2px solid #eee; text-align: right; color: #666;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; color: #555;">Item Total:</td>
                <td style="padding: 10px; text-align: right; color: #333; font-weight: bold;">₹${order.subtotal.toFixed(2)}</td>
              </tr>
              ${order.deliveryFee > 0 ? `
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; color: #555;">Delivery Fee:</td>
                <td style="padding: 10px; text-align: right; color: #333; font-weight: bold;">₹${order.deliveryFee.toFixed(2)}</td>
              </tr>
              ` : ''}
              <tr>
                <td colspan="2" style="padding: 12px; text-align: right; color: #222; font-size: 18px; font-weight: bold; border-top: 2px solid #eee;">Total Paid:</td>
                <td style="padding: 12px; text-align: right; color: #EAB308; font-size: 18px; font-weight: bold; border-top: 2px solid #eee;">₹${order.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <h3 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 8px;">Delivery Details</h3>
          <p style="color: #555; margin-bottom: 5px;"><strong>Phone:</strong> ${addr.mobile || order.user?.mobile || 'N/A'}</p>
          <p style="color: #555; margin-top: 0; line-height: 1.5;"><strong>Address:</strong><br>${fullAddress}</p>
          
          <div style="background-color: #FFFBEB; border: 1px solid #FEF08A; padding: 15px; border-radius: 6px; text-align: center; margin-top: 25px;">
            <p style="color: #B45309; margin: 0; font-weight: bold;">🕒 Your order will be delivered on or before 9:00 PM IST.</p>
          </div>
          
          <p style="text-align: center; color: #777; font-size: 14px; margin-top: 30px;">
            If you have any questions about your order, please contact us at<br>
            <a href="mailto:csktrucktheni@gmail.com" style="color: #ca8a04; text-decoration: none;">csktrucktheni@gmail.com</a>
          </p>
        </div>
      </div>
    `;

    // Define email options
    const mailOptions = {
      from: `"CSK Food Truck" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Order Confirmation - CSK Food Truck #${order.orderId}`,
      html: htmlContent
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent successfully to ${customerEmail}. Message ID: ${info.messageId}`);
    return true;

  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false; // Return false but don't throw to prevent crashing the order flow
  }
};

const sendFeedbackEmail = async (name, email, message) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('EMAIL_USER or EMAIL_PASS not set in environment. Skipping feedback email.');
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const adminEmails = ['csktrucktheni@gmail.com', 'kousikaashree.6607@gmail.com'];

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: #0b0b0e; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #FACC15; margin: 0;">CSK Food Truck</h1>
          <p style="color: #aaa; margin: 5px 0 0 0;">New User Feedback Received</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #333; border-bottom: 2px solid #FACC15; padding-bottom: 10px;">Feedback Details</h2>
          
          <p style="color: #555; font-size: 16px;"><strong>Name:</strong> ${name}</p>
          <p style="color: #555; font-size: 16px;"><strong>Email:</strong> ${email}</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #FACC15;">
            <p style="margin: 0; color: #333; font-style: italic; line-height: 1.6;">"${message}"</p>
          </div>
          
          <p style="text-align: center; color: #777; font-size: 12px; margin-top: 30px;">
            This email was sent from the CSK Food Truck Contact Form.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"CSK Food Truck Website" <${process.env.EMAIL_USER}>`,
      to: adminEmails.join(', '),
      subject: `New Feedback from ${name}`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Feedback email sent successfully. Message ID: ${info.messageId}`);
    return true;

  } catch (error) {
    console.error('node-mailer Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    return false;
  }
};

const sendOtpEmail = async ({ email, otp, purpose = 'login' }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('EMAIL_USER or EMAIL_PASS not set in environment. Skipping OTP email.');
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const purposeText =
      purpose === 'signup'
        ? 'complete your signup'
        : 'complete your login';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; background: #f7f7f7;">
        <div style="background:#0b0b0e; color:#fff; padding:18px; border-radius:10px 10px 0 0; text-align:center;">
          <h2 style="margin:0; color:#FACC15;">CSK Food Truck</h2>
        </div>
        <div style="background:#fff; padding:20px; border-radius:0 0 10px 10px;">
          <p style="margin-top:0;">Use this OTP to ${purposeText}:</p>
          <div style="font-size:30px; letter-spacing:8px; font-weight:700; color:#111; text-align:center; margin:16px 0;">
            ${otp}
          </div>
          <p style="margin:0; color:#555;">This OTP expires in 5 minutes. Do not share it with anyone.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"CSK Food Truck" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code - CSK Food Truck',
      html: htmlContent
    });

    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

module.exports = { sendOrderConfirmationEmail, sendFeedbackEmail, sendOtpEmail };
