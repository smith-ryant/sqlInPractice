/**
 * This file serves as the main entry point for the server.
 */

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { SERVER_PORT } = process.env;
const {
  getAllClients,
  getPendingAppointments,
  getUpcomingAppointments,
  getPastAppointments,
  approveAppointment,
  completeAppointment,
  deleteAppointment,
} = require("./controller.js");

app.use(express.json());
app.use(cors());

/**
 * GET request handler for retrieving all clients.
 * @name GET /clients
 * @function
 */
app.get("/clients", getAllClients);

/**
 * GET request handler for retrieving pending appointments.
 * @name GET /pending
 * @function
 */
app.get("/pending", getPendingAppointments);

/**
 * GET request handler for retrieving upcoming appointments.
 * @name GET /upcoming
 * @function
 */
app.get("/upcoming", getUpcomingAppointments);

/**
 * GET request handler for retrieving past appointments.
 * @name GET /appt
 * @function
 */
app.get("/appt", getPastAppointments);

/**
 * PUT request handler for approving an appointment.
 * @name PUT /approve
 * @function
 */
app.put("/approve", approveAppointment);

/**
 * PUT request handler for completing an appointment.
 * @name PUT /complete
 * @function
 */
app.put("/complete", completeAppointment);

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`));
