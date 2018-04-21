function getResults(){
    var filename = "images.png";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/results", false);
    xhr.setRequestHeader("File-Name", filename);
    xhr.onreadystatechange = function(){
        console.log("success");
    }
    xhr.send();
}