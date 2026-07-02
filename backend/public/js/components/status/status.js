function updateStatus(data) {

    if (typeof data.cpu === "number") {
        document.getElementById("cpu").innerText = data.cpu + "%";
    }

    if (typeof data.ram === "number") {
        document.getElementById("ram").innerText = data.ram + "%";
    }

    if (data.state) {

        document.getElementById("cpuState").innerText = data.state.cpu;
        document.getElementById("ramState").innerText = data.state.ram;

        document.getElementById("cpuState").className =
            "state " + data.state.cpu;

        document.getElementById("ramState").className =
            "state " + data.state.ram;
    }

}

window.updateStatus = updateStatus;