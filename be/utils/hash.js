const bcrypt = require('bcryptjs');
exports.hash = (pw) => bcrypt.hashSync(pw, 10);
exports.compare = (pw, hash) => bcrypt.compareSync(pw, hash);