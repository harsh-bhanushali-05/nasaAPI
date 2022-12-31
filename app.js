const express=require("express");
const app=express();
const ejs=require("ejs");
const https=require("https");
const { type } = require("os");
const { reset } = require("nodemon");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
app.set('view engine', 'ejs');
app.use(express.static("public"));
var titles="";
var description="";
var img="";
const d = new Date();
let day = d.getDate()-1;//i am not sure why is this happening its mostly becoz of the timezone difference between india and USA.
let month=d.getMonth()+1;//getmonth return values from 0-11 so JAN is 0 thus to get the correct month we neeed to add 1 to getmonth().
let year=d.getFullYear();
var date=year+"-"+month+"-"+day;//this is just to format the date as per nasa api documentation. 
var i=0;
var nodays=[31,28,31,30,31,30,31,31,30,31,30,31];
function reduce_date(){
if(day==1 && month==1){
    year=year-1;
    day=31;
    month=12;
}
else if(day==1){
    month=month-1;
    day=nodays[month-1];
}
else{
    day=day-1;
}
i--;
date=year+"-"+month+"-"+day;
}

function increase_date(){
    if(day==31 && month==12){
        year=year+1;
        day=1;
        month=01;
    }
    else if(day==nodays[month]){
        month=month+1;
        day=nodays[month-1];
    }
    else{
        day=day+1;
    }
    i++;
    date=year+"-"+month+"-"+day;
}
   
async function get_data(){
    
    const response =await fetch("https://api.nasa.gov/planetary/apod?api_key=3SozCbLWWgp0Z1nWRFStdAZyTTRQPr5ZlXnqx16K&date="+date);
    const data = await response.json();
    titles= await data.title;
    description= await data.explanation;
    var media=await data.media_type;
    if(media=="image")
    img=await data.url;
    else
    img="https://ibb.co/5GzSyMG";
}
app.get("/",function(req,res){
    res.redirect("/"+date);
});
app.get("/:date", async function(req,res){

    await get_data();
    res.render("index",{description:description,title:titles,img:img,date:date});
});
app.post("/prev",function(req,res){
    console.log("the prev button was pressed");
    reduce_date();
    res.redirect("/"+date);
});
app.post("/next",function(req,res){
    console.log("the next button was pressed");
    increase_date();
    if(i>0){
        res.send("<h1> data has not been uploaded</h1>");
    }
    res.redirect("/"+date);
});
// what are we trying to do --- the main page will redirect us to a new page with the date in the link if we click the previous button the link will be updated to match the date needed 
app.listen(3000,function(){
console.log("works and is listening at local host 3000");
});

