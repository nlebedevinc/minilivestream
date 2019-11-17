let mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    uuid = require('uuid'),
    Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    stream_key: String,
});

UserSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateStreamKey = () => {
    return uuid();
};


module.exports = UserSchema;
