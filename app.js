const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const getModel = require("./model");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const app = express();
/*
var gVerify = require("./public/javascripts/gVerify.js");
var b = gVerify.getName;
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", require("ejs").__express); 

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); //用于解析post参数
app.use(cookieParser()); 
//app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(__dirname + '/public'));



 
const User = getModel("User"); //获取模型
 
function isLogin(req, res, next) 
{ //一个中间件 检测cookie上面使用username属性 如果有 那么证明登录成功过 否正跳到登录页面
    const { username } = req.cookies; 
    if (username)
    { //如果存在
        next();
    } 
    else 
    {
        res.redirect("/login");
    }
}
 
app.get("/login", function (req, res) 
{ //登录
    res.render("login");
})
app.post("/login", function (req, res) 
{
    let { username, password, yzm } = req.body;
    //password = crypto.createHmac("md5", "myh").update(password).digest("hex"); 
    User.findOne({ username}, function (err, doc) 
    {
        if (err) 
        { //对错误处理
        }
        if (doc) 
        { //查询数据库发现存在 那么就到个人页面
            if (doc.password === password) { //如果密码验证码匹配
                if(yzm == 1){
                    res.cookie("username", username);
                    res.redirect("/main");
                    res.end();
                }
                else{
                    res.redirect("login");
                }
            } 
            else 
            {
                res.render("error");
            }
        } 
        else 
        {
            res.redirect("register");
        }
    })
    
})
 

app.get("/register", function (req, res) 
{
    res.render("register");
})
app.post("/register", function (req, res) 
{
    let { username, password } = req.body;
    //password = crypto.createHmac("md5", "myh").update(password).digest("hex");
    User.create({ username, password }, function (err, doc) 
    {
        if (err) 
        {//对错误处理
        }
        //目前对账号的唯一性不做要求
        if (doc) 
        { //注册成功
            res.cookie("username", username);
            res.redirect("/main");
            res.end();
        }
    })
 
})
 


app.get("/main", isLogin, function (req, res) 
{ //通过isLogin中间件来判断是否登录过
    const { username } = req.cookies;
    res.render("main", { username })
})


app.get("/", isLogin, function (req, res) {
    res.redirect("login")
})

app.listen(8080, () => {
    console.log("http://localhost:8080已经打开")
});