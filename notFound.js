const notFound = (req, res) => {
  res.status(404).json({ message: "Page does not exit!" });
};

module.exports = notFound;
