+ function($) {
    'use strict';

    // UPLOAD CLASS DEFINITION
    // ======================



    var dropZone = document.getElementById('drop-zone');
    var uploadForm = document.getElementById('js-upload-form');

      
      dropZone.ondragover = function () { this.className = 'hover upload-drop-zone'; return false; };
      dropZone.ondragend = function () { this.className = 'upload-drop-zone'; return false; };
      dropZone.ondrop = function (event) {
      event.preventDefault && event.preventDefault();
      this.className = 'upload-drop-zone';
     

      // now do something with:
      var files = event.dataTransfer.files;
      if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/uploads',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }

  return false;
};



    $("#tab").hide();
    $(".test").show();
    
    /* dropZone.ondrop = function(e) {
        e.preventDefault();
        this.className = 'upload-drop-zone';

        startUpload(e.dataTransfer.files)
    }

    dropZone.ondragover = function() {
        this.className = 'upload-drop-zone drop';
        return false;
    }

    dropZone.ondragleave = function() {
        this.className = 'upload-drop-zone';
        return false;
    }
    */

    $(document).ready(function(){

    $("#submitButton").click(function(){
        $(".test").slideUp("fast");
        $("#tab").show();
        $('.progress-bar').text('0%');
        $('.progress-bar').width('0%');

    });
    $("#getStarted").click(function(){
        $(".test").slideUp("fast");
    });
    $("#readMore").click(function(){
        $(".test").slideUp("slow");
    });
    $(".navbar-brand").click(function(){
        $(".test").slideDown("fast");
    });
    $("#home").click(function(){
        $(".test").slideDown("fast");
    });
});

}(jQuery);
$('.clickArea').on('click', function (){
    
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#fileInput').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/uploads',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});