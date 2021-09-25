const mongoose = require("mongoose");
const conn = mongoose.createConnection("mongodb://localhost/test"); //连接数据库
 
const UserSchema = new mongoose.Schema({ //设置Schema
    username: { //用户名
        type: String,
        required: true
    },
    password: { //密码
        type: String,
        required: true
    },
    rTime: { //注册时间
        type: Number,
        default: Date.now()
    }
})
 
const User = conn.model("User", UserSchema);
 
const model = { User };
module.exports = function (modelName) {
    return model[modelName];
}