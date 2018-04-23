function check() {
    if (document.getElementById('confPassword').value != document.getElementById('regPassword').value) {
        document.getElementById('confPassword').setCustomValidity('Password Must be Matching.');
    }
    else {// input is valid -- reset the error message
        document.getElementById('confPassword').setCustomValidity('');
    }
}
function ValidateEmail() {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(document.getElementById('email').value)) {
        return (true)
    }
    alert("You have entered an invalid email address!")
    return (false)
}

function changeType() {
    document.getElementById('regPassword').type = (document.userInfo.option.value = (document.userInfo.option.value == 1) ? '-1' : '1') == '-1' ? 'text' : 'password';
}

function changeType2() {
    document.getElementById('confPassword').type = (document.userInfo.option2.value = (document.userInfo.option2.value == 1) ? '-1' : '1') == '-1' ? 'text' : 'password';
}

var count = 0;

function drop(event) {
    event.preventDefault();
    //document.getElementById("mydz").style.width = "500px";
}

Dropzone.options.mydz = {
    dictDefaultMessage: "Click or drag image into box",
    addRemoveLinks: true,
    uploadMultiple: false,
    maxFiles: 1,
    renameFile: function (file) {
        var temp = file.name;
        return "image." + temp.slice((temp.lastIndexOf(".") - 1 >>> 0) + 2);
    },
    acceptedFiles: "image/png,image/gif,image/jpg,image/jpeg,image/tif,image/tiff,image/bmp,image/raw,image/wmf, image/webp, image/img, image/pct, image/tga, image/jpe, image/ani, image/heif, image/heic",

    init: function () {
        this.on("maxfilesexceeded", function (file) {
            count++;
            document.getElementById("steps").innerHTML = "<span style='color:red'>ONLY ONE FILE ALLOWED, PLEASE REMOVE LAST FILE.</span>";
            $("#get-results").hide();
        });
    }
};

$(document).ready(function () {
    Dropzone.autoDiscover = false;

    var dropzone = new Dropzone(".dropzone", {
    });

    dropzone.on("removedfile", function (file) {
        count--;
        if (count == 0) {
            document.getElementById("steps").innerHTML = "Step 1: Upload your image.";
            $("#get-results").hide();
            $(".dz-message").show();
        }
        else if (count == 1) {
            document.getElementById("steps").innerHTML = "Step 2: Click Submit to send image to classifier.";
            $("#get-results").show();
        }
        else {
            $("#get-results").hide();
        }
    });

    dropzone.on("processing", function (file) {

        $("#convert").show();
        $(".dz-message").hide();

    });

    dropzone.on("success", function(file, response) {

        $("#classification-results").html (response);

    });

    /*$('#get-results').click(function () {
         $("#convert").hide();
      var displayResources = $('#results-table');
      var k=1;
      $.ajax({
      type: "POST",
      url: "example.json",
      success: function(result){
        console.log(result);
        var output="<div  id='tab' ><div class='container'><div class='table-responsive' id='results-table' style='overflow-x:auto;'><table class='table table-bordered table-hover'><tr><th class='col-md-1'>Result Ranking</th><th class='col-md-1'>Percent Confidence</th><th>Ant Species</th><th>Common Name</th><th  data-field='action' data-formatter='ActionFormatter'>Link</th></tr><tbody>";
        for (var i in result){
          if(i==0){
            output+="<tr class='success'><td>" + k + "</td><td>" + result[i].confidence + "</td><td>" + result[i].species + "</td><td>"+result[i].name+"</td><td><a href='"+result[i].url+"' class='btn btn-default' target='_blank'>More Info</a></td></tr>";}
          else{
            output+="<tr><td>" + k + "</td><td>" + result[i].confidence + "</td><td>" + result[i].species + "</td><td>"+result[i].name+"</td><td><a target='_blank' href='"+result[i].url+"' class='btn btn-default' >More Info</a></td></tr>";}
            k++;
          }
        output+="</tbody></table>";
        displayResources.html(output);
        $("table").addClass("table");
        }
      });
    });
    */


    //$("#registration").hide();
    $("#convert").hide();
    //$("#returnHome").hide();
    //$("#login").show();
    $("#get-results").hide();
    /*$("#cancelButton").show();
    $("#tab").hide();
    $(".jTron").show();
    $("#return").hide();
    $("#resultText").hide();
    $("#return").hide();
    $("#dropz").hide();
    $("#regJTron").hide();
    */

    //$("#get-results").click(function(){
    //$("#convert").hide();
    /*$("#returnHome").hide();
    $(".jTron").slideUp("slow");
    $("#tab").show();
    $(".dropzone").hide();
    */
    //document.getElementById("steps").innerHTML = "";
    /*$("#get-results").hide();
    //$("#resultText").css("padding-top", "20px");
    $("#return").show();
    $("#resultText").show();
    //$("#resBox").hide();
    */
    //$("#dropz").css("display", "none");
    //$('.dz-preview').remove();

    //});

    $("#classifyAgain").click(function () {
        //$(".jTron").hide();
        $("#returnHome").show();
        // $("#resultText").hide();
        // $("#tab").hide();
        // $("#dropz").show();//css("display", "block");
        //$("#dropz").css("padding-top", "10px");
        // $(".dropzone").show();
        document.getElementById("steps").innerHTML = "Submit another image for classifying.";
        //$("#get-results").show();
        //document.getElementById("resultText").innerHTML = "Previous Results:";
        //$("#classifyAgain").hide();
        // dropzone.options.maxFiles=dropzone.options.maxFiles+1;
        dropzone.removeAllFiles(true);





        //$('div.dz-success').remove();
        //$(".dz-message").show();
        //$("#get-results").hide();

        // $("#returnButton").hide();
    });

    $("#cancelButton").click(function () {
        $("#convert").hide();
        $("#tab").show();
        //  document.getElementById("steps").innerHTML = "Step 1: Upload your image.";
    });

    $("#learnBtn").click(function () {
        $("#convert").hide();

    });

    $("#sBtn").click(function () {
        /* $("#returnHome").show();
         $(".jTron").hide();
         //$("#regJTron").hide();
         $("#login").hide();
         //$("#registration").hide();
         $("#dropz").show();
         $(".dropzone").show();
         $("#steps").show();
         */
        document.getElementById("steps").innerHTML = "Step 1: Upload your image.";
    });

    /*  REGISTRATION MOVED TO NEW FILE
    $("#regBtn").click(function(){
        $(".jTron").hide();
        $("#regJTron").slideDown("slow");
        $("#login").hide();
        $("#registration").show();
    });
  
    $("#regCancelBtn").click(function(){
        $(".jTron").show();
        $("#regJTron").hide();
        $("#login").show();
        $("#registration").hide();
    });
    */

    $(".navbar-brand").click(function () {
        $("#convert").hide();
        //SHOW ONLY IF NOT ALREADY LOGGED IN
        /*
        $(".jTron").slideDown("fast");
         $("#returnHome").hide();
        //$("#regJTron").hide();
        //$("#registration").hide();
        $("#dropz").show();
        $("#tab").hide();
        $("#resultText").hide();
        $("#dropz").css("display", "block");
        $("#return").hide();
        //$('div.dz-success').remove();
        //$(".dz-message").show();
        $("#steps").hide();
        $("#login").show();
        */
        document.getElementById("steps").innerHTML = "";
        //dropzone.removeAllFiles(true); 
        //$(".dropzone").hide();
        //$("#dropz").css("display", "block");
        //$("#dropz").css("padding-top", "120px");

    });

    $("#home").click(function () {
        $("#convert").hide();
        //SHOW ONLY IF NOT ALREADY LOGGED IN

        //  $(".jTron").slideDown("fast");
        // $("#returnHome").hide();
        //$("#regJTron").hide();
        //$("#registration").hide();
        // $("#dropz").show();
        //   $("#tab").hide();
        // $("#resultText").hide();
        // $("#dropz").css("display", "block");
        // $("#return").hide();
        //$('div.dz-success').remove();
        //$(".dz-message").show();
        // $("#steps").hide();
        // $("#login").show();
        //document.getElementById("steps").innerHTML = "";
        dropzone.removeAllFiles(true);
        // $(".dropzone").hide();
        //$("#dropz").css("display", "block");
        //$("#dropz").css("padding-top", "120px");

    });

    $("#returnHome").click(function () {
        $("#convert").hide();
        //SHOW ONLY IF NOT ALREADY LOGGED IN
        /*  $("#returnHome").hide();
          $("#login").show();
          $(".jTron").slideDown("fast");
         // $("#regJTron").hide();
         // $("#registration").hide();
          $("#dropz").show();
          $("#tab").hide();
          $("#resultText").hide();
          $("#dropz").css("display", "block");
          $("#return").hide();
          //$('div.dz-success').remove();
          //$(".dz-message").show();
          $("#steps").hide();
          */
        //document.getElementById("steps").innerHTML = "";
        //dropzone.removeAllFiles(true); 
        //$(".dropzone").hide();
        //$("#dropz").css("display", "block");
        //$("#dropz").css("padding-top", "120px");
    });

});
(jQuery);