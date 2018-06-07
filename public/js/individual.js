//google.charts.load('current', {packages: ['corechart']});
google.charts.load('current', { 'packages': ['corechart', 'bar'] });

//var options = {'title':"Composition of Earth's atmosphere  ",
//        'width':400,
//        'height':300};

var options1 = {
    'title': 'Revision distribution by year and by user type',
    'width': 1000,
    'height': 800
};

var options2 = {
    'title': 'Revision proportion by user type',
    'width': 1000,
    'height': 800
};

var options3 = {
    'title': 'Revision distribution by year of user ',
    'width': 1000,
    'height': 800
};


//var data
//var testdata
var shown = 0
var top5

var article_data1
var article_data2
var overall_data1
var overall_data2

var barChart_data

var chartData


function drawBarChart(selected_user, article_name) {
    options3['title'] = 'Revision distribution by year of user'
    var data = google.visualization.arrayToDataTable(barChart_data);
    for (var item in selected_user) {
        options3['title'] += selected_user[item]
        options3['title'] += ', '
    }
    options3['title'] += 'for Article '
    options3['title'] += article_name
    var chart = new google.charts.Bar($('#IndividualChart')[0]);
    chart.draw(data, google.charts.Bar.convertOptions(options3));
}



function drawPieChart(name) {
    options2['title'] = 'Revision proportion by user type';

    options2['title'] += ' for article ';
    options2['title'] += name;
    var data = google.visualization.arrayToDataTable(article_data2)
    var chart = new google.visualization.PieChart($('#IndividualChart')[0]);
    chart.draw(data, options2);
}

function drawColumnChart(name) {
    options1['title'] = 'Revision distribution by year and by user type';
    options1['title'] += ' for article ';
    options1['title'] += name;
    var data = google.visualization.arrayToDataTable(article_data1)
    var chart = new google.charts.Bar($('#IndividualChart')[0])
    chart.draw(data, google.charts.Bar.convertOptions(options1))
}

$(document).ready(function () {
    var selected_article = $('#articleList').val();
    $('selectedTitle').val($('#articleList').val());
    $.getJSON('/individual', null, function (data) {
        var articles = data['names']
        //console.log(articles)
        for (var i = 0; i < articles.length; i++) {
            var option = document.createElement('option')
            option.innerHTML = articles[i]
            option.setAttribute('value', i)
            document.getElementById('articleList').appendChild(option)
        }

    })
    $('#chartType').bind("change", function (event) {
        var obj = $('#chartType');
        chart_name = obj.find("option:selected").text()

        var obj_name = $('#articleList');
        article_name = obj_name.find("option:selected").text()

        event.preventDefault();

        if (chart_name == "Bar Chart1") {
            $('#checkboxArea').html("")
            shown = 0
            drawColumnChart(article_name)
            //drawBar()
        }

        if (chart_name == "Pie Chart1") {
            $('#checkboxArea').html("")
            shown = 0
            var number_Administrator = 0
            var number_Anonymous = 0
            var number_Bot = 0
            var number_Regular = 0
            var tmp = new Array()
            tmp.push(['User type', 'Number'])
            for (var year in article_data1) {
                if (year == 0) { continue }
                number_Administrator += article_data1[year][1]
                number_Anonymous += article_data1[year][2]
                number_Bot += article_data1[year][3]
                number_Regular += article_data1[year][4]
            }
            tmp.push(['Administrator', number_Administrator])
            tmp.push(['Anonymous', number_Anonymous])
            tmp.push(['Bot', number_Bot])
            tmp.push(['Regular user', number_Regular])
            article_data2 = tmp
            drawPieChart(article_name)
            //drawPie()
        }


        if (chart_name == "Top5 Bar Chart" && shown == 0) {

            for (var item in top5) {
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'name';
                checkbox.value = item;

                var label = document.createElement('label');
                //   	   			label.htmlFor = 'CheckBoxTop5';
                label.appendChild(document.createTextNode(top5[item]));

                $('#checkboxArea').append(checkbox);
                $('#checkboxArea').append(label);
                $('#checkboxArea').append("<br />");
            }
            shown = 1
            var button = document.createElement('input');
            button.type = 'button';
            button.id = 'submit'
            button.value = 'Get the Chart';
            button.className = 'btn btn-login';
            $('#checkboxArea').append(button);
            $('#submit').click(function (event2) {

                var obj2 = $('#articleList');
                article_name = obj2.find("option:selected").text()

                var id_array = new Array();
                var selected_user = new Array();


                $('#checkboxArea :checked').each(function () {
                    id_array.push($(this).val());
                })
                if (id_array.length == 0) {
                    alert('please select at least one top user')
                }
                else {
                    event2.preventDefault();
                    for (var item in id_array) {
                        user_id = id_array[item]
                        top5_user_name = top5[user_id]
                        selected_user.push(top5_user_name)
                    }
                    paras = { users: selected_user, title: article_name }

                    //$.ajaxSettings.async = false
                    var get=$.getJSON('/individual/getTop5Data', paras, function (data) {
                        barChart_data = data['result']
                    })
                    //$.ajaxSettings.async = true

                    get.done(function(){drawBarChart(selected_user, article_name)})
                }
            })
        }
    })

    $('#navlist').click(function (event) {
        event.preventDefault();
    })
});

$('#articleList').bind("change", function (event) {
    $('#IndividualChart').html("")
    $('#chartType option:first').prop("selected", "selected")
    $('#checkboxArea').html("")
    shown = 0

    var obj = $('#articleList');
    article_name = obj.find("option:selected").text()
    title = { title: article_name }
    console.log(title)
    event.preventDefault();

    if (article_name == 'Select Article') {
        return
    }

    //$.ajaxSettings.async = false
    var update = $.getJSON('/individual/update', title, function (data) {
        alert("Updated " + data['data']+ ' new revisions')
        //return data;
    })
    console.log(update)
    update.done(function(){
        $.getJSON('/individual/getArticleData', title, function (data) {
            top5 = data['top5']
            top5String = 'Top 5 users: ' + data['top5'].join(", ")
            Title = 'Title: ' + data['Title']
            TotalNumber = 'Total number of revisions: ' + data['TotalNumber']
            //alert("top5"+top5+"top5String"+top5String+"Title"+Title+"TotalNumber"+TotalNumber)
            $('#SelectedTitle').text(Title)
            $('#SelectedRevisions').text(TotalNumber)
            $('#SelectedTop5').text(top5String)
    
            article_data1 = data['result']
            return data;
        })
    })
    //$.ajaxSettings.async = true

})

