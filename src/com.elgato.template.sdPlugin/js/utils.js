const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(name) {
    name = name.replace(' ', '_').toLowerCase();
    const soundFilePath = `./static/alerts/${name}.mp3`;
    fetch(soundFilePath)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data))
        .then(buffer => {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start();
        })
        .catch(error => {
            console.error("Error playing sound:", error);
        });
}