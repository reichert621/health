const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const send = (msg = {}) => {
  const { recipient, subject, html } = msg;

  if (!recipient) return Promise.reject(new Error('A recipient is required!'));
  if (!subject) return Promise.reject(new Error('A subject is required!'));
  if (!html) return Promise.reject(new Error('Email html content is required!'));

  const message = {
    subject,
    html,
    to: recipient,
    from: 'notifications@uprite.co'
  };

  return sendgrid.send(message);
};

// const example = () => {
//   const msg = {
//     recipient: 'reichertjalex@gmail.com',
//     subject: 'Alex just checked in!',
//     html: '<a href="http://uprite.co/">Click here</a> to view!'
//   };
//
//   return send(msg)
//     .then(result => console.log('Sent!', result))
//     .catch(err => console.log('Error sending!', err));
// };

module.exports = send;
