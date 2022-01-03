const { sendMail } = require('../email.service');

describe('Email Service Test', () => {
  it('should send a email', async () => {
    const mailOptions = {
      from: 'IRENT IFPI 2021 🏡 <irent.ifpi.2021@gmail.com>',
      to: 'mwenyo@gmail.com',
      subject: 'Email Test 👨🏾‍🔬 - iRent IFPI',
      text: 'Email de teste',
      html: '<h1>Ignorar email</html>',
    };
    const email = await sendMail(mailOptions)
      .then((result) => result)
      .catch((error) => error);
    expect(email.accepted).toEqual(["mwenyo@gmail.com"]);
  });

  it('should get a error sending invalid mailOptions', async () => {
    const email = await sendMail({})
    expect(email).toHaveProperty('stack');
  });
});