const jwt = require("jsonwebtoken");
const {config} = require("../config/secretData")


exports.authToken = (req,res,next) => {
  let token = req.header("auth-token");
  if(!token){
    return res.status(400).json({msg:"you must send token in this url to get data"});
  }
  try{
    // קידוד הפוך לאובייקט שאנחנו נוכל לדבר איתו
    // שהיה שמור בהצפנה ש הטוקן
    let decodeToken = jwt.verify(token,config.jwtSecret);
    // מייצר מאפיין חדש עם המידע של היוזר בעיקר
    // האיי די שלו 
    // הסיבה שיצרנו אותו בתור מאפיין
    // כדי שהפונקציה הבאה בתור בשרשור תכיר את המאפיין
    req.userData = decodeToken;
    // יש הצלחה ועוברים לפונקציה הבאה בשרשור של הראוט
    next();
  }
  catch (err) {
    console.log(err);
    res.status(400).json({msg:"token invalid or expired"});
  }
}