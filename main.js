const container = document.getElementById('container');
const webcam = document.getElementById('webcam');
var mediaDevices = navigator.mediaDevices;
var on = false;
var model = undefined;
var bounding = webcam.getClientRects().item(0);

function toggleCam() {
    on = !on;
    if (!on) {
        webcam.pause();
        webcam.srcObject = null;
        return;
    }

    mediaDevices.getUserMedia({
        video: {
            width: 1280,
            height: 960,
            frameRate: { ideal: 30, max: 45 },
        },
        audio: false,
    })
    .then(stream => {
        webcam.srcObject = stream;
        webcam.addEventListener("loadedmetadata", () => {
            webcam.play();
            predictWebcam();
        });
    })
}

cocoSsd.load().then(laodedModel => model = laodedModel);

function predictWebcam() {
    if (!on) {
        clearFrames();
        return;
    }

    // Start classifying a frame in the stream
    model.detect(webcam).then(predictions => {
        // Remove all detection frames
        clearFrames();
        

        // Draw the confident predictions
        for(let i = 0; i < predictions.length; i++) {
            if (predictions[i].score > 0.66) {
                const p = document.createElement('p');
                p.innerText = `${predictions[i].class} - ${Math.round(parseFloat(predictions[i].score*100))}%`;

                // Create a highlight frame
                const highlighter = document.createElement('div');
                highlighter.classList.add('highlighter');
                highlighter.style.left = `${bounding.left + scale(predictions[i].bbox[0], 1280, parseInt(webcam.width))}px`;
                highlighter.style.top = `${bounding.top + scale(predictions[i].bbox[1], 960, parseInt(webcam.height))}px`;
                highlighter.style.width = `${scale(predictions[i].bbox[2], 1280, parseInt(webcam.width))}px`;
                highlighter.style.height = `${scale(predictions[i].bbox[3], 960, parseInt(webcam.height))}px`;

                highlighter.appendChild(p);
                container.appendChild(highlighter);
            }
        }

        // Call function when browser is ready
        window.requestAnimationFrame(predictWebcam);
    });
}

function clearFrames() {
    for(let i = 1; i < container.children.length; i++)
        container.removeChild(container.children[i]);
}

function scale(n, origin, scale) {
    return n/origin*scale;
}