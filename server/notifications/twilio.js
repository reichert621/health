const Twilio = require('twilio');

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER
} = process.env;

const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const send = (msg, recipient) => {
  if (!msg) return Promise.reject(new Error('A message is required!'));
  if (!recipient) return Promise.reject(new Error('A recipient is required!'));

  const message = {
    body: msg,
    to: recipient,
    from: TWILIO_PHONE_NUMBER
  };

  return client.messages.create(message);
};

// const example = () => {
//   return send('Alex checked in!', '+16508239124')
//     .then(msg => console.log('Sent!', msg))
//     .catch(err => console.log('Error sending!', err));
// };

module.exports = send;
