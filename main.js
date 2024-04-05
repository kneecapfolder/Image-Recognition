const webcam = document.getElementById('webcam');
var mediaDevices = navigator.mediaDevices;

function openCam() {
    mediaDevices.getUserMedia({
        video: true,
        audio: false,
    })
    .then(stream => {
        webcam.srcObject = stream;
        webcam.addEventListener("loadedmetadata", () => {
            webcam.play();
        });
    })
}