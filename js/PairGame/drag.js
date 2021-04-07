// target elements with the "draggable" class
interact('.draggable')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            restriction: "parent",
            endOnly: false,
            elementRect: {top: 0, left: 0, bottom: 1, right: 1}
        },
        // enable autoScroll
        autoScroll: true,

        onstart: function (event) {
            var target = event.target;
            target.style.zIndex = GameManager.get().getZIndex();
        },

        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
        }
    });

function dragMoveListener(event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */

var dragConnections = {};

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '.yes-drop',
    // Require a 30% element overlap for a drop to be possible
    overlap: 0.30,

    // listen for drop related events:

    ondropactivate: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;
        if (!((dropzoneElement.classList.contains('title') && draggableElement.classList.contains('title')) || (dropzoneElement.classList.contains('image') && draggableElement.classList.contains('image')))) {
            // add active dropzone feedback
            dropzoneElement.classList.add('drop-active');
        }
    },
    ondragenter: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;
        if (!((dropzoneElement.classList.contains('title') && draggableElement.classList.contains('title')) || (dropzoneElement.classList.contains('image') && draggableElement.classList.contains('image')) || dropzoneElement.classList.contains('dropped-into'))) {
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
            draggableElement.classList.add('dragged-in');
        }
    },
    ondragleave: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;
        if (draggableElement.classList.contains('dropped-into')) {
            dropzoneElement.classList.remove('dropped-into');
            if (dragConnections[dropzoneElement.getAttribute('id')]) {
                dragConnections[dropzoneElement.getAttribute('id')].classList.remove('dropped-into');
            }
            draggableElement.classList.remove('dropped-into');
            if (dragConnections[draggableElement.getAttribute('id')]) {
                dragConnections[draggableElement.getAttribute('id')].classList.remove('dropped-into');
            }
        }
        // remove the drop feedback style
        dropzoneElement.classList.remove('drop-target');
        dropzoneElement.classList.remove('can-drop');
        dropzoneElement.classList.remove('dragged-in');
        draggableElement.classList.remove('can-drop');
        draggableElement.classList.remove('dragged-in');
    },
    ondrop: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;
        if (!((dropzoneElement.classList.contains('title') && draggableElement.classList.contains('title')) || (dropzoneElement.classList.contains('image') && draggableElement.classList.contains('image')) || dropzoneElement.classList.contains('dropped-into'))) {
            //event.relatedTarget.textContent = 'Dropped';
            if (GameManager.get().match(draggableElement, dropzoneElement)) {
                draggableElement.classList.add('matched');
                draggableElement.style.zIndex = GameManager.get().getZIndex();
                dropzoneElement.classList.add('matched');
                dropzoneElement.style.zIndex = GameManager.get().getZIndex();
            }
            else {
                draggableElement.classList.add('dropped-into');
                dropzoneElement.classList.add('dropped-into');
                dragConnections[draggableElement.getAttribute('id')] = dropzoneElement;
                dragConnections[dropzoneElement.getAttribute('id')] = draggableElement;
            }
        }
    },
    ondropdeactivate: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;
        // remove active dropzone feedback
        dropzoneElement.classList.remove('drop-active');
        dropzoneElement.classList.remove('drop-target');
        draggableElement.classList.remove('drop-active');
        draggableElement.classList.remove('drop-target');
    }
});

