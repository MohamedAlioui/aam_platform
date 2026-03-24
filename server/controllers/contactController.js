import nodemailer from 'nodemailer';

// @desc   Send contact message
// @route  POST /api/contact
// @access Public
export const sendContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message, lang } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email to admin
    const adminMailOptions = {
      from: `"AAM Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `[AAM] ${subject || 'Nouveau message de contact'} — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #050d1f; color: #f0f6ff; padding: 30px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00b8d4; font-size: 28px; margin: 0;">AAM</h1>
            <p style="color: #4fc3f7; margin: 5px 0;">Académie Arabe de la Mode</p>
          </div>
          <h2 style="color: #c9a84c; border-bottom: 1px solid #1a2a6c; padding-bottom: 10px;">Nouveau message de contact</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; color: #4fc3f7; width: 120px;"><strong>Nom:</strong></td><td style="padding: 8px;">${name}</td></tr>
            <tr><td style="padding: 8px; color: #4fc3f7;"><strong>Email:</strong></td><td style="padding: 8px;">${email}</td></tr>
            <tr><td style="padding: 8px; color: #4fc3f7;"><strong>Téléphone:</strong></td><td style="padding: 8px;">${phone || 'Non fourni'}</td></tr>
            <tr><td style="padding: 8px; color: #4fc3f7;"><strong>Sujet:</strong></td><td style="padding: 8px;">${subject || 'Général'}</td></tr>
          </table>
          <div style="background: #0d1b3e; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 3px solid #00b8d4;">
            <p style="margin: 0; line-height: 1.7;">${message}</p>
          </div>
          <p style="color: #1565c0; font-size: 12px; margin-top: 30px; text-align: center;">AAM Platform — ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `
    };

    // Confirmation email to user
    const userMailOptions = {
      from: `"Académie Arabe de la Mode" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: lang === 'ar' ? 'شكراً لتواصلك مع أكاديمية عربية للموضة' : 'Merci pour votre message — Académie Arabe de la Mode',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #050d1f; color: #f0f6ff; padding: 30px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00b8d4; font-size: 36px; letter-spacing: 8px; margin: 0;">AAM</h1>
            <p style="color: #4fc3f7;">Académie Arabe de la Mode</p>
          </div>
          <h2 style="color: #c9a84c; text-align: center;">
            ${lang === 'ar' ? 'شكراً لتواصلك معنا' : 'Merci pour votre message'}
          </h2>
          <p style="line-height: 1.8; color: #e0e8ff;">
            ${lang === 'ar'
              ? `عزيزي/عزيزتي ${name}،\n\nلقد تلقينا رسالتك وسنقوم بالرد عليك في أقرب وقت ممكن. فريقنا متاح لمساعدتك.`
              : `Cher(e) ${name},\n\nNous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais. Notre équipe est à votre disposition.`
            }
          </p>
          <div style="background: #0d1b3e; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #1a2a6c;">
            <p style="color: #4fc3f7; margin: 0 0 10px 0;"><strong>${lang === 'ar' ? 'رسالتك:' : 'Votre message:'}</strong></p>
            <p style="margin: 0; line-height: 1.7;">${message}</p>
          </div>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #1a2a6c;">
            <p style="color: #00b8d4; margin: 0;">Académie Arabe de la Mode</p>
            <p style="color: #1565c0; font-size: 12px;">Record du Monde Guinness ™</p>
          </div>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    // Don't fail silently — but log and return success to not block UX
    res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
  }
};
