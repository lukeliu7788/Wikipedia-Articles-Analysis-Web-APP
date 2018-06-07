var result;
$(document).ready(function(){
    var table = $('#table').DataTable({
        "columnDefs":[
            {
                "targets":0,
                "className": 'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            }
        ],
        searching : false,
        // sorting : false
    });
    $('#searchButton').on('click', function(){
        table.clear().draw();
        var author=$("#search").val();
        console.log(author);
        $.getJSON('/author/getArticles',{user:author},function(data){
            index=0
            result=data['articles']
            //console.log(result)
            for(var i=0;i<result.length;i++){
                table.row.add([
                    null,
                    ++index,
                    result[i]._id.title,
                    result[i]._id.user,
                    result[i].total
                ]).draw();
                
            }
            // for(var i=0;i<result.length;i++){
            //     $("#data").append(createRow(result[i]));
            // }
        })
    })
    $('#table tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        var index = parseInt(data[1]);
        //console.log(index)
        var row = table.row(this);
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            $(this).removeClass('shown');
        }
        else {
            // Open this row
            row.child(format(index-1)).show();
            $(this).addClass('shown');
        }
        
        //alert( 'You clicked on '+data[1]+'\'s row' );
    });
})

function createRow(data){
    var row = document.createElement('tr');
    var title = document.createElement('td');
    title.innerHTML= data._id;
    row.appendChild(title);

    var total = document.createElement('td');
    total.innerHTML = data.total;
    row.appendChild(total);

    var view = document.createElement('td');
    view.innerHTML= '<button class="timestamp">view</button>';
    row.appendChild(view);

    return row;
}

function format (index) {
    // `d` is the original data object for the row
    var content=document.createElement('table');
    content.setAttribute("cellpadding",5)
    content.setAttribute("cellspacing",5)
    content.setAttribute("border",5)
    content.setAttribute("sytle","padding-left:50px")
    console.log(result[index])
    for (var i=0;i<result[index].timestamp.length;i++){
        var row = document.createElement('tr')
        var td = document.createElement('td')
        td.innerHTML = "Revision "+(i+1) + " : " + result[index].timestamp[i];
        row.appendChild(td);
        content.appendChild(row);
    }
    // var div1 = document.createElement('div')
    // div1.setAttribute("class","timeline")
    // var div2 =document.createElement('div')
    // div2.setAttribute("class","container left")
    // var div3 =document.createElement('div')
    // div3.setAttribute("class","content")
    // var p = document.createElement('p')
    // //p.setAttribute("class","timeline-event-thumbnail")
    // p.innerHTML = "asd"
    // div3.appendChild(p)
    // div2.appendChild(div3)
    // div1.appendChild(div2)
    // return div1;
    
    // console.log(content);
    // return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
    //     content+
    //     '</table>';
    return content;
    
}
