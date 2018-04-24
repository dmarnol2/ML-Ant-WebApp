$(function () {
    var count = 0;

    $("#user-image-drop-zone").on("drop", function (e) {
        e.preventDefault();
    });

    $("#user-image-drop-zone").click (function (e) {
        e.preventDefault();
    });

    Dropzone.options['user-image-drop-zone'] = {
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

    Dropzone.autoDiscover = false;

    var dropzone = new Dropzone(".dropzone", { });

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

    dropzone.on("success", function (file, response) {

        $("#classification-results").html(response);

    });

    $("#convert").hide();

});