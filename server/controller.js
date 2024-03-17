/**
 * Controller module for handling database queries and operations.
 * @module controller
 */

require("dotenv").config();
const { CONNECTION_STRING } = process.env;
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(CONNECTION_STRING);

let nextEmp = 5;

/**
 * Retrieves all clients from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
module.exports = {
  getAllClients: (req, res) => {
    sequelize
      .query(
        `SELECT * FROM cc_users AS u
         JOIN cc_clients AS c ON u.user_id = c.user_id;`
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },

  /**
   * Retrieves all pending appointments from the database.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  getPendingAppointments: (req, res) => {
    sequelize
      .query(
        `SELECT a.appt_id, a.date, a.service_type, a.notes, u.first_name, u.last_name 
         FROM cc_appointments AS a
         JOIN cc_users AS u ON a.appt_id = u.user_id
         WHERE a.approved = false
         ORDER BY a.date DESC;`
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },

  /**
   * Retrieves all past appointments from the database.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  getPastAppointments: (req, res) => {
    sequelize
      .query(
        `SELECT a.appt_id, a.date, a.service_type, a.approved, a.completed, u.first_name, u.last_name 
         FROM cc_appointments AS a
         JOIN cc_emp_appts AS ea ON a.appt_id = ea.appt_id
         JOIN cc_employees AS e ON e.emp_id = ea.emp_id
         JOIN cc_users AS u ON e.user_id = u.user_id
         WHERE a.approved = true AND a.completed = true
         ORDER BY a.date DESC;`
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },

  /**
   * Retrieves all upcoming appointments from the database.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  getUpcomingAppointments: (req, res) => {
    sequelize
      .query(
        `SELECT a.appt_id, a.date, a.service_type, a.approved, a.completed, u.first_name, u.last_name 
         FROM cc_appointments AS a
         JOIN cc_emp_appts AS ea ON a.appt_id = ea.appt_id
         JOIN cc_employees AS e ON e.emp_id = ea.emp_id
         JOIN cc_users AS u ON e.user_id = u.user_id
         WHERE a.approved = true AND a.completed = false
         ORDER BY a.date DESC;`
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },

  /**
   * Approves an appointment and assigns it to the next available employee.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  approveAppointment: (req, res) => {
    let { apptId } = req.body;

    sequelize
      .query(
        `UPDATE cc_appointments
         SET approved = true
         WHERE appt_id = ${apptId};`
      )
      .then(() => {
        return sequelize.query(
          `INSERT INTO cc_emp_appts (emp_id, appt_id)
           VALUES (${nextEmp}, ${apptId}),
                        (${nextEmp + 1}, ${apptId});`
        );
      })
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
        nextEmp += 2;
      })
      .catch((err) => console.log(err));
  },

  /**
   * Marks an appointment as completed and removes it from the employee's schedule.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  completeAppointment: (req, res) => {
    let { apptId } = req.body;

    sequelize
      .query(
        `UPDATE cc_appointments
         SET completed = true
         WHERE appt_id = ${apptId};`
      )
      .then(() => {
        return sequelize.query(
          `DELETE FROM cc_emp_appts
           WHERE appt_id = ${apptId};`
        );
      })
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },
};
