exports.success = (res, data) => {
  res.json({ success: true, data });
};

exports.error = (res, message, code = 400) => {
  res.status(code).json({ success: false, message });
};
