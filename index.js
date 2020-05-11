const express=require("express");
const https=require("https");
const bodyparser=require("body-parser");
const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.get("/",function(req,res)
{
res.sendFile(__dirname+"/index.html");
});

app.post("/top",function(req,res){

  const ip="https://api.ipfind.com/me?auth=022a5857-bf75-40eb-8ea1-ecfc3856c9aa";
  https.get(ip,function(response){
    console.log(response.statusCode);
    response.on("data",function(data){
    const geoip=JSON.parse(data);
    const ipadd=geoip.ip_address

    const location="https://api.ipdata.co/"+ipadd+"?api-key=ab745adc56bc20222b7c5158ab7d994fc0ff75214f1d43cf2674e797";
    https.get(location,function(response){
      console.log(response.statusCode);
      response.on("data",function(data){
      const geoData=JSON.parse(data);
      const city=geoData.city;
      const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid=6db1c096eb7341c093c54b1e4c8c630a";
      https.get(url,function(response){
        console.log(response.statusCode);
        response.on("data",function(data){
        const weatherData=JSON.parse(data);
        const temp=weatherData.main.temp;
        const description=weatherData.weather[0].description;
        const icon=weatherData.weather[0].icon;
        const imgurl="http://openweathermap.org/img/wn/"+icon+"@2x.png";
        res.setHeader('Content-type','text/html')
        res.write('<center><h1>The Temperature in '+ city +' is ' + temp + ' Degree Celcius</h1>');
        res.write('<h1>It is '+description+' in '+city+'</h1>');
        res.write('<img src='+imgurl+'>');
        res.send()

      });
    });
});
});
});
});
});

app.post("/bottom",function(req,res){
  const query=req.body.location;
  const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&units=metric&appid=6db1c096eb7341c093c54b1e4c8c630a";
  https.get(url,function(response){

    console.log(response.statusCode);
    response.on("data",function(data){

    const weatherData=JSON.parse(data);
    const temp=weatherData.main.temp;
    const description=weatherData.weather[0].description;
    const icon=weatherData.weather[0].icon;
    const imgurl="http://openweathermap.org/img/wn/"+icon+"@2x.png";
    res.setHeader('Content-type','text/html')
    res.write('<center><h1>The Temperature in '+ query +' is ' + temp + ' Degree Celcius</h1>');
    res.write('<h1>It is '+description+' in '+query+'</h1>');
    res.write('<img src='+imgurl+'>');
    res.send()

  });
});
});
app.listen(process.env.PORT||3000,function(){
  console.log("Server is running");
});
