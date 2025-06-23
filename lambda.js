const axios = require("axios");

//Load environment variables
if (process.env.IS_OFFLINE) {
  require("dotenv").config();
}

const freshdeskDomain = process.env.FRESHDESK_DOMAIN;
const freshdeskApiKey = process.env.FRESHDESK_API_KEY;

if (!freshdeskDomain || !freshdeskApiKey) {
  throw new Error(
    "FRESHDESK_DOMAIN and FRESHDESK_API_KEY must be set in environment variables"
  );
}

//Body from intercom will look like this:
// {
//   "subject": "Issue with product",
//   "description": "I am facing an issue with the product.",
//   "email": "example@example.com",
//   "priority": 1,
//   "status": 2
// }

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    console.log("Received data:", body);

    const freshdeskRes = await axios.post(
      `https://${freshdeskDomain}.freshdesk.com/api/v2/tickets`,
      {
        subject: body.subject || "New Ticket",
        description: body.description || "No description",
        email: body.email || "default@example.com",
        priority: 1,
        status: 2,
      },
      {
        auth: {
          username: freshdeskApiKey,
          password: "X",
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result: freshdeskRes.data,
      }),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message,
      }),
    };
  }
};
