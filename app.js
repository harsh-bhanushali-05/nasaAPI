const express=require("express");
const app=express();
const ejs=require("ejs");
const https=require("https");
app.set('view engine', 'ejs');
app.use(express.static("public"));
var titles="";
var description="";
var img="";
var date="2022-09-07";
https.get("https://api.nasa.gov/planetary/apod?api_key=3SozCbLWWgp0Z1nWRFStdAZyTTRQPr5ZlXnqx16K&date="+date,function(ress){
    ress.on("data",function(data){
        const dataJ=JSON.parse(data);
         titles=dataJ.title;
         description=dataJ.explanation;
         img=dataJ.url;
        console.log(description);
        
    });
});
app.get("/",function(req,res){
    res.render("index",{description:description,title:titles,img:img});
});
// what are we trying to do --- the main page will redirect us to a new page with the date in the link if we click the previous button the link will be updated to match the date needed 
app.listen(3000,function(){
console.log("works");
});