const User = require('../models/user');
const {formatDistanceToNow} = require('date-fns');

module.exports.index = async(req, res) => {
    const user = await User.findById(req.user._id).populate('quizes');
    res.render('calendar/index', {quizes: user.quizes, formatDistanceToNow});
}