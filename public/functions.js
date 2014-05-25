function showGraph(title,xAxis_title,yAxis_title,valueSuffix,reading){
			console.log("inside show graph");

			$('#container').highcharts({
				chart: {
		            zoomType: 'x'
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



function parseData(type){
    var currentTime = (new Date()).getTime; //current timestamp
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
                        timetext.split('\n').every(function(item){
                            var comma=item.indexOf(',');
                            var date = item.substring(6,comma).replace(/\s/,"T");
                            var dateUTC = (new Date(date)).getTime();
                            var temperature = Number(item.match(/Temperature(.\d+[.]\d+)/)[1]);
                            if(temperature != null )
                                return readings.push([dateUTC, temperature ]);

                            else 
                                return false;
                        });
                        showGraph("Temperature readings","Time","Temperature(C)","C",readings);
                        break;
                    case 'Humidity':
                        timetext.split('\n').every(function(item){
                            var comma=item.indexOf(',');
                            var date = item.substring(6,comma).replace(/\s/,"T");
                            var dateUTC = (new Date(date)).getTime();
                            var humidity = Number(item.match(/Humidity(.\d+[.]\d+)/)[1]);
                            if(humidity != null)
                               return readings.push([dateUTC, humidity ]);
                            else
                                return false;
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
                            if(light != null )
                                return readings.push([dateUTC,light ]);    
                            else 
                                return false;
                        });
                        showGraph("Light readings","Time","Light","",readings);
                        break;

                }
                
               

            
        }
    }
    fileread.open("GET","sensordata.txt",true);
    fileread.send();
}