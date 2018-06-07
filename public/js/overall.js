google.charts.load('current', { packages: ['corechart'] });

var options = {
	'title': "Revision Number Distribution by User Type",
	'width': 1000,
	'height': 800,
	'colors': ['#FA8072', '#00CED1', '#FFA500', '#D3D3D3']
};


var options1 = {
	title: "Revision Number Distribution by Year and User Type",
	width: 1000,
	height: 800,
};

var chartData

$(document).ready(function () {

	$.getJSON('/overall/ChartData', null, function (rdata) {
		chartData = rdata;
		//console.log(data);
	});

	$.getJSON('/overall', { number: 3 }, function (data) {
		var top_result=''
		for(var i=0;i<data['TOP'].length;i++){
			top_result+=data['TOP'][i]['_id']+", ";
		}
		top_result=top_result.substring(0,top_result.length-2)
		
		$('#top').text(top_result)

		var bot_result=''
		for(var i=0;i<data['BOT'].length;i++){
			bot_result+=data['BOT'][i]['_id']+", ";
		}
		bot_result=bot_result.substring(0,bot_result.length-2)
		


		$('#bot').text(bot_result)
		$('#most').text(data['MOST'])
		$('#least').text(data['LEAST'])
		$('#longest').text(data['LONGEST'])
		$('#shortest').text(data['SHORTEST'])
		
	})

	$("#pie").click(function (event) {
		event.preventDefault();
		drawPie()
	})

	$("#bar").click(function (event) {
		event.preventDefault();
		drawBar()
	})


});

$('#searchIndividualButton').on('click', function(){
	var number=$("#searchIndividual").val();
	number=parseInt(number)
	//console.log(author);
	$.getJSON('/overall/change', { number: number }, function (data) {
		var top_result=''
		console.log(data)
		for(var i=0;i<data['TOP'].length;i++){
			top_result+=data['TOP'][i]['_id']+", ";
		}
		top_result=top_result.substring(0,top_result.length-2)
		var index='Top ' + number;
		var indexBot = 'Bottom ' + number;
		$('#topN').text(index)
		$('#top').text(top_result)

		var bot_result=''
		for(var i=0;i<data['BOT'].length;i++){
			bot_result+=data['BOT'][i]['_id']+", ";
		}
		bot_result=bot_result.substring(0,bot_result.length-2)
		$('#botN').text(indexBot)		
		$('#bot').text(bot_result)
	})

})

$("#overallButton").on('click',function(){
	$('#searchIndividual').val("")
	$.getJSON('/overall/ChartData', null, function (rdata) {
		chartData = rdata;
		//console.log(data);
	});

	$.getJSON('/overall', { number: 3 }, function (data) {
		var top_result=''
		console.log(data)
		for(var i=0;i<data['TOP'].length;i++){
			top_result+=data['TOP'][i]['_id']+", ";
		}
		top_result=top_result.substring(0,top_result.length-2)
		var index='Top 3';
		var indexBot = 'Bottom 3';
		$('#topN').text(index)
		$('#top').text(top_result)

		var bot_result=''
		for(var i=0;i<data['BOT'].length;i++){
			bot_result+=data['BOT'][i]['_id']+", ";
		}
		bot_result=bot_result.substring(0,bot_result.length-2)
		$('#botN').text(indexBot)		
		$('#bot').text(bot_result)
		


		$('#bot').text(bot_result)
		$('#most').text(data['MOST'])
		$('#least').text(data['LEAST'])
		$('#longest').text(data['LONGEST'])
		$('#shortest').text(data['SHORTEST'])
		
	})
})

function drawPie() {
	graphData = new google.visualization.DataTable();
	graphData.addColumn('string', 'UserType');
	graphData.addColumn('number', 'Percentage');
	var numberofuser = [0, 0, 0, 0];
	$.each(chartData, function (i, item) {
		if (item._id.usertype == 'admin')
			numberofuser[0] += item.number;
		else if (item._id.usertype == 'anon')
			numberofuser[1] += item.number;
		else if (item._id.usertype == 'bot')
			numberofuser[2] += item.number;
		else
			numberofuser[3] += item.number;
	});
	var resultjson = { 'Administrator': numberofuser[0], 'Anonymous': numberofuser[1], 'Bot': numberofuser[2], 'Regual user': numberofuser[3] }
	$.each(resultjson, function (key, val) {
		graphData.addRow([key, val]);
	})
	var chart = new google.visualization.PieChart($("#myChart")[0]);
	chart.draw(graphData, options);
}

function drawBar() {

	var chartbardata = [
		['Year', 'Administrator', 'Anonymous', 'Bot', 'Regual user'],
		['2001', 0, 0, 0, 0], ['2002', 0, 0, 0, 0], ['2003', 0, 0, 0, 0], ['2004', 0, 0, 0, 0],
		['2005', 0, 0, 0, 0], ['2006', 0, 0, 0, 0], ['2007', 0, 0, 0, 0], ['2008', 0, 0, 0, 0],
		['2009', 0, 0, 0, 0], ['2010', 0, 0, 0, 0], ['2011', 0, 0, 0, 0], ['2012', 0, 0, 0, 0],
		['2013', 0, 0, 0, 0], ['2014', 0, 0, 0, 0], ['2015', 0, 0, 0, 0], ['2016', 0, 0, 0, 0],
		['2017', 0, 0, 0, 0], ['2018', 0, 0, 0, 0]
	];
	$.each(chartData, function (i, item) {
		yearindex = item._id.year - 2000;
		if (item._id.usertype == 'admin')
			chartbardata[yearindex][1] += item.number;
		else if (item._id.usertype == 'anon')
			chartbardata[yearindex][2] += item.number;
		else if (item._id.usertype == 'bot')
			chartbardata[yearindex][3] += item.number;
		else
			chartbardata[yearindex][4] += item.number;
	});
	console.log(chartbardata);
	var graphData = google.visualization.arrayToDataTable(chartbardata);
	var chart = new google.visualization.ColumnChart($("#myChart")[0]);
	chart.draw(graphData, options1);
}