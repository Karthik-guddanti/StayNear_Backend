import { Request, Response } from 'express';
import { sendMail } from '../utility/sendMail';

export const handlePartnerRequest = async (req: Request, res: Response) => {
  const { firstName, lastName, mobile, email, partnershipType, message } = req.body;

  if (!firstName || !email || !partnershipType) {
    return res.status(400).json({ message: 'Required fields are missing.' });
  }

  try {
    const subject = `New Partnership Inquiry: ${partnershipType}`;
    const textContent = `
      A new partnership request has been submitted on StayNear.

      Name: ${firstName} ${lastName || ''}
      Mobile: ${mobile || 'Not provided'}
      Email: ${email}
      Partnership Type: ${partnershipType}
      
      Message:
      ${message || 'No message provided.'}
    `;

    // Send the email to your support address
    await sendMail('support@staynear.com', subject, textContent);

    res.status(200).json({ message: 'Your request has been sent successfully!' });
  } catch (error) {
    console.error('Error sending partner request email:', error);
    res.status(500).json({ message: 'Failed to send your request. Please try again later.' });
  }
};