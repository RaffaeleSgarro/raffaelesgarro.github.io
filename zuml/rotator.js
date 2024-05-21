//http://www.elated.com/res/File/articles/development/javascript/jquery/smooth-rotatable-images-css3-jquery/
var newImageZIndex = 1; // To make sure newly-loaded images land on top of images on the table
var imageBeingRotated = false; // The DOM image currently being rotated (if any)
var mouseStartAngle = false; // The angle of the mouse relative to the image centre at the start of the rotation
var imageStartAngle = false; // The rotation angle of the image at the start of the rotation


// argument is an array
function initWidget(note) {
    // Add an event handler to stop the rotation when the mouse button is released
    $(document).mouseup(stopRotate);
    // Process each photo in turn...
    $.each(note, function (index) {
        $(this).data('currentRotation', 0);
        // Make the photo draggable

        $(this).draggable({
            //containment: 'parent',
            //stack: '#lighttable img',
            //cursor: 'pointer',
            start: dragStart,
            stop: function(evt, ui) {
              ui.helper.css("z-index", 2);
            }
        });
        // Make the photo rotatable
        $(this).mousedown(startRotate);
        // Make the lightbox pop up when the photo is clicked
        $(this).click(function () {
            setCurrentEditable($(this));
        });
    });
}

// Prevent the image being dragged if it's already being rotated
function dragStart(e, ui) {
  setCurrentEditable(ui.helper);
  ui.helper.css("z-index", 3);
  if (imageBeingRotated) return false;
}

// Start rotating an image
function startRotate(e) {
    // Exit if the shift key wasn't held down when the mouse button was pressed
    if (!e.shiftKey) return;
    // Track the image that we're going to rotate
    imageBeingRotated = this;
    // Store the angle of the mouse at the start of the rotation, relative to the image centre
    var imageCentre = getImageCentre(imageBeingRotated);
    var mouseStartXFromCentre = e.pageX - imageCentre[0];
    var mouseStartYFromCentre = e.pageY - imageCentre[1];
    mouseStartAngle = Math.atan2(mouseStartYFromCentre, mouseStartXFromCentre);
    // Store the current rotation angle of the image at the start of the rotation
    imageStartAngle = $(imageBeingRotated).data('currentRotation');
    // Set up an event handler to rotate the image as the mouse is moved
    $(document).mousemove(rotateImage);
    return false;
}

// Stop rotating an image
function stopRotate(e) {
    // Exit if we're not rotating an image
    if (!imageBeingRotated) return;
    // Remove the event handler that tracked mouse movements during the rotation
    $(document).unbind('mousemove');
    // Cancel the image rotation by setting imageBeingRotated back to false.
    // Do this in a short while - after the click event has fired -
    // to prevent the lightbox appearing once the Shift key is released.
    setTimeout(function () {
        imageBeingRotated = false;
    }, 10);
    return false;
}

// Rotate image based on the current mouse position
function rotateImage(e) {
    // Exit if we're not rotating an image
    if (!e.shiftKey) return;
    if (!imageBeingRotated) return;
    // Calculate the new mouse angle relative to the image centre
    var imageCentre = getImageCentre(imageBeingRotated);
    var mouseXFromCentre = e.pageX - imageCentre[0];
    var mouseYFromCentre = e.pageY - imageCentre[1];
    var mouseAngle = Math.atan2(mouseYFromCentre, mouseXFromCentre);
    // Calculate the new rotation angle for the image
    var rotateAngle = mouseAngle - mouseStartAngle + imageStartAngle;
    // Rotate the image to the new angle, and store the new angle
    rotateCSS(imageBeingRotated, rotateAngle);
    $(imageBeingRotated).data('currentRotation', rotateAngle);
    return false;
}


// Calculate the centre point of a given image
function getImageCentre(image) {
    // Rotate the image to 0 radians
    rotateCSS(image, 0);
    // Measure the image centre
    var imageOffset = $(image).offset();
    var imageCentreX = imageOffset.left + $(image).width() / 2;
    var imageCentreY = imageOffset.top + $(image).height() / 2;
    // Rotate the image back to its previous angle
    var currentRotation = $(image).data('currentRotation');
    rotateCSS(image, currentRotation);
    // Return the calculated centre coordinates
    return Array(imageCentreX, imageCentreY);
}


// angle is in radians
function rotateCSS(element, angle) {
    $(element).css('transform', 'rotate(' + angle + 'rad)');
    $(element).css('-moz-transform', 'rotate(' + angle + 'rad)');
    $(element).css('-webkit-transform', 'rotate(' + angle + 'rad)');
    $(element).css('-o-transform', 'rotate(' + angle + 'rad)');
}
