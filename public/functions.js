function showGraph(title,xAxis_title,yAxis_title,valueSuffix,reading){
			console.log("inside show graph");

			$('#container').highcharts({
				chart: {
		            zoomType: 'x',

		        },
            title: {
                text: title,
                x: -20 //center
            },

            xAxis: {
                title:{
                    text:xAxis_title
                },
            	type: 'datetime'
            },
            yAxis: {
                title: {
                    text: yAxis_title
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: valueSuffix
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: title,
            	data: reading

            }]
        });

}

function viewfunc(type,optid){
    console.log('inside view func');
        var select=document.getElementById(optid);
        var selectedOption=Number(select.options[select.selectedIndex].value);
        console.log(selectedOption);
        parseData(type,selectedOption);
}


function parseData(type,timespan){
    var currentTime = (new Date()).getTime(); //current timestamp

    var startTime = timeSelector(currentTime, timespan);
    var fileread;

    var readings = [];

    if(window.XMLHttpRequest){
        fileread=new XMLHttpRequest();
    }
    fileread.onreadystatechange=function(){
        
        if((fileread.readyState===4 || fileread.readyState===0) && fileread.status===200){
 
            var timetext=fileread.responseText;



                switch (type){
                    case 'Temperature':

                        timetext.split('\n').forEach(function(item){
                            var comma=item.indexOf(',');
                            var date = item.substring(6,comma).replace(/\s/,"T");
                            var dateUTC = (new Date(date)).getTime();
                           // var temperature = Number(item.match(/Temperature(.\d+[.]\d+)/)[1]);
                            
                            var temperature = Number(item.substring(38,43));

                            console.log("date date obj: "+ new Date(date));
                            console.log("dateutc date obj:" + new Date(dateUTC));
                            if(temperature != null && (dateUTC - 3*60*60*1000) >= startTime){
                                readings.push([dateUTC, temperature]);
                            }

                          
                        });
                        showGraph("Temperature readings","Time","Temperature(C)","C",readings);
                        break;
                    case 'Humidity':
                        timetext.split('\n').forEach(function(item){
                            var comma=item.indexOf(',');
                            var date = item.substring(6,comma).replace(/\s/,"T");
                            var dateUTC = (new Date(date)).getTime();

                            var humidity = Number(item.substring(55,60));
                            //console.log(humidity );
                            if(humidity != null&& (dateUTC - 3*60*60*1000)>= startTime)
                               readings.push([dateUTC, humidity ]);

                        });
                        showGraph("Humidity readings","Time","Humidity(% RH)","% RH",readings);
                        break;
                    case 'Luminosity':
                        var str = "Light";
                        
                        // /&& currentTime <= dateUTC
                        timetext.split('\n').every(function(item){
                            var comma=item.indexOf(',');
                            var date = item.substring(6,comma).replace(/\s/,"T");
                            var dateUTC = (new Date(date)).getTime();
                            var start = item.indexOf('Light') + str.length + 1;
                            var end = item.length;
                            var light =Number(item.substring(start,end));
                            if(light != null && (dateUTC - 3*60*60*1000)>= startTime)
                                return readings.push([dateUTC,light ]);    

                        });
                        showGraph("Light readings","Time","Light","",readings);
                        break;

                }
                
               

            
        }
    }
    fileread.open("GET","sensordata.txt",true);
    fileread.send();
}

function timeSelector(currentTime, timespan){
    var startTime ;
   // console.log('curent time:' + currentTime);
    switch(timespan){
        case 0.5:
            startTime = currentTime - 0.5*60*60*1000;
            break;
        case 1:
            startTime = currentTime - 1*60*60*1000;
            break;
        case 5:
            startTime = currentTime - 5*60*60*1000;
            break;
        case 24:
            startTime = currentTime - 24*60*60*1000;
            break;
    }
    //console.log("start" +startTime);
    //console.log("date object:" + new Date(startTime));
    //console.log("" + currentTime);
    return startTime;


}