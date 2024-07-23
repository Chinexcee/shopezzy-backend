const nodemailer = require ('nodemailer');

const sendEmail = async( username, userEmail, subjectOfMail )=>{

    
  try {

      // Create Transport
      const mailerTransport = nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: `${process.env.EMAIL}`,
              pass: `${process.env.EMAIL_PASSWORD}`
          } 
      })
  
      // Creating email details to send
      const mailDetails = {
          from: `${process.env.EMAIL}`,
          to: userEmail,
          subject: subjectOfMail,
          html: ` 
              <div>
                  <h1> Hello ${username} </h1>
                  <h2> We are excited to have you join Shopezzy! </h2>
  
                  <p>We will always be grateful for your effort in supporting us in building the world's number 1 e-commerce store.

                  Click the link below to reset password ${www.shopezzy.com}, ${process.env.JWT_SECRET}
                  </p>

                  
  
                  <h6>Thanks.</h6>
              </div>
          `
      }

      // Ask Transport to send email detaisl
      const result = await mailerTransport.sendMail(mailDetails)

      return result
      
  } catch (error) {
      return console.log(error)
  }

}




module.exports = sendEmail;