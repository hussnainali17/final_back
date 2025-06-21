const mongoose=require('mongoose')
function ConnectToDB(){
    mongoose.connect(process.env.CONNECT_DB).then(()=>{
    console.log("Connected to mongodb");
}).catch((err)=>{
    console.log(err);
})}

module.exports=ConnectToDB;