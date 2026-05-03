const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'business.pilotimpex.data@gmail.com',
        pass: 'ywbp vrje cjrs kvzi'
    }
});

const formSubmit = async (request, response) => {

    try {

        const { firstName, lastName, companyName, email, mobileNumber, requirement,inquiryType } = request.body;

        const mailToOwner = {
            from: email, // Website user's email (form input)
            to: "business.pilotimpex.data@gmail.com", // Company owner name who will receive Mail
            subject: `New Contact Message from ${firstName}`,
            text: `
        You received a new message:
        
        Name: ${firstName} ${lastName}
        Email: ${email}
        Mobile Number : ${mobileNumber}
        Inquiry Type : ${inquiryType}
        Company : ${companyName}
        Message: ${requirement}
      `
        };

        await transporter.sendMail(mailToOwner);

        const mailToUser = {
            from: "business.pilotimpex.data@gmail.com", // Website user's email (form input)
            to: email, // Website owner's Gmail
            subject: `${inquiryType} Inquiry`,
            text: `
        Thank You For ${inquiryType} Inquiry Our Team will contact you soon.
      `
        };

        await transporter.sendMail(mailToUser);

        response.status(200).json({ success: true, message: "Email sent via SSL successfully!" });

    } catch (error) {

        console.log(error);

        response.status(500).json({ success: false, message: "Email failed to send." });

    }



}

module.exports = { formSubmit }