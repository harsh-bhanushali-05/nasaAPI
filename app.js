const express=require("express");
const app=express();
const ejs=require("ejs");
const https=require("https");
app.set('view engine', 'ejs');
app.use(express.static("public"));
var titles="";
var description="";
var img="";
const d = new Date();
let day = d.getDate();
let month=d.getMonth();
let year=d.getFullYear();
var date=year+"-"+month+"-"+day;
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
    date=year+"-"+month+"-"+day;
}

app.get("/",function(req,res){
    res.redirect("/"+date);
});
app.get("/:date",function(req,res){
    https.get("https://api.nasa.gov/planetary/apod?api_key=3SozCbLWWgp0Z1nWRFStdAZyTTRQPr5ZlXnqx16K&date="+date,function(ress){
        ress.on("data",function(data){
            const dataJ=JSON.parse(data);
             titles=dataJ.title;
             description=dataJ.explanation;
             img=dataJ.url;
            console.log(description); 
        });
    });
    res.render("index",{description:description,title:titles,img:img});
});
app.post("/prev",function(req,res){
    console.log("the prev button was pressed");
    reduce_date();
    res.redirect("/"+date);
});
app.post("/next",function(req,res){
    console.log("the next button was pressed");
    increase_date();
    res.redirect("/"+date);
});
// what are we trying to do --- the main page will redirect us to a new page with the date in the link if we click the previous button the link will be updated to match the date needed 
app.listen(3000,function(){
console.log("works");
});

