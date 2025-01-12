const formatAppointments = (appointments) => {
  const uniqueDates = new Set();
  const appointmentsFormatted = {};
  appointments.map((appointment) => {
    const [date, time] = appointment.formattedDate.split(",");
    if (uniqueDates.has(date)) {
      appointmentsFormatted[date] = appointmentsFormatted[date] || [];
      appointmentsFormatted[date].push([appointment._id, time]);
    } else {
      uniqueDates.add(date);
      appointmentsFormatted[date] = [[appointment._id, time]];
    }
    return undefined;
  });
  return appointmentsFormatted;
};

export default formatAppointments;
