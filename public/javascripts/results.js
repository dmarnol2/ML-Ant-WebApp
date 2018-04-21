function getResults(){
    sendRequest();
}

function sendRequest(){
        
    $.ajax({
        type: 'GET',
        contentType: "text/plain",
        url: "/results",
        success:function(output) {
            addResults(output);
        },
        error:function(output) {
        }
    });

    
    
    
    
    
    /*
    xhr = new XMLHttpRequest();
    xhr.open("GET", "/results", true);
    xhr.onreadystatechange = function(){
        if(xmlhr.readyState == 4 && xhttp.status == 200){
            jsonResponse = JSON.parse(xhr.responseText);
            addResults(jsonResponse);
        }
    }
    xhr.send();
    */
}

function addResults(result){
    
    //Generate table with results of request.
    //
    var output="<div  id='tab' ><div class='container'><div class='table-responsive' id='results-table' style='overflow-x:auto;'><table class='table table-bordered table-hover'><tr><th class='col-md-1'>Result Ranking</th><th class='col-md-1'>Percent Confidence</th><th>Ant Species</th><th>Common Name</th><th  data-field='action' data-formatter='ActionFormatter'>Link</th></tr><tbody>";
    for (var i in result){
      if(i==0){
        output+="<tr class='success'><td>" + k + "</td><td>" + result[i].confidence + "</td><td>" + result[i].species + "</td><td>"+result[i].name+"</td><td><a href='"+result[i].url+"' class='btn btn-default' target='_blank'>More Info</a></td></tr>";}
      else{
        output+="<tr><td>" + k + "</td><td>" + result[i].confidence + "</td><td>" + result[i].species + "</td><td>"+result[i].name+"</td><td><a target='_blank' href='"+result[i].url+"' class='btn btn-default' >More Info</a></td></tr>";}
        k++;
      }
    output+="</tbody></table>";
    
    var table = document.getElementById("results-table");
    table.innerHTML = output;
}