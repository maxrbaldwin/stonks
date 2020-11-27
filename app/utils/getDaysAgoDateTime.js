function getDaysAgoDateTime(dateTime, daysAgo) {
  const oneDayInMilliseconds = (24 * 60 * 60 * 1000);
  const daysAgoDateTime = oneDayInMilliseconds * daysAgo;
  return dateTime - daysAgoDateTime;
}

module.exports = getDaysAgoDateTime;