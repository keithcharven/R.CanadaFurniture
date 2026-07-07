const { DesignAppointment, User } = require('../models');

exports.create = async (req, res) => {
  try {
    const { client_full_name, email, country_code, contact_number, preferred_date, preferred_time, project_type, meeting_type, consent_given } = req.body;

    if (!client_full_name || !email || !contact_number || !meeting_type) {
      return res.status(400).json({ error: 'Name, email, contact number, and meeting type are required.' });
    }

    const appointment = await DesignAppointment.create({
      user_id: req.user ? req.user.id : null,
      client_full_name,
      email,
      country_code: country_code || '+63',
      contact_number,
      preferred_date,
      preferred_time,
      project_type,
      meeting_type,
      consent_given: consent_given || false,
      status: 'pending'
    });

    res.status(201).json({ message: 'Appointment booked successfully!', appointment });
  } catch (err) {
    console.error('Create appointment error:', err);
    res.status(500).json({ error: 'Failed to book appointment.' });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await DesignAppointment.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
};

// Admin
exports.getAll = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await DesignAppointment.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      appointments: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) }
    });
  } catch (err) {
    console.error('Get appointments error:', err);
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const appointment = await DesignAppointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });
    const { status } = req.body;
    if (status) appointment.status = status;
    await appointment.save();
    res.json({ message: 'Appointment updated.', appointment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update appointment.' });
  }
};
