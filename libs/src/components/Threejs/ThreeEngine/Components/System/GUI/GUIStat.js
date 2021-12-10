import Stats from "three/examples/jsm/libs/stats.module"
function GUIStats(eventComp, domID, container) {
    const domid = domID ? domID + "-stats" : "GUI-stats";
    var std = document.getElementById(domid);
    if (std) {
        std.remove();
    }

    const stats = new Stats();
    stats.dom.id = domid;
    stats.dom.style.position = "absolute";
    let isAlreadyStats = false;

    eventComp.animate.addListener("GUIStats", animate);
    console.log();
    this.setActive = function (isActive) {

        if (isActive) {
            if (isAlreadyStats) return;
            // console.log(container.id)
            container.appendChild(stats.dom);
            isAlreadyStats = true;
        }
        else {
            if (isAlreadyStats) {
                var std = document.getElementById(stats.dom.id);
                if (std) {
                    std.remove();
                }
                isAlreadyStats = false;
            }
        }
    }
    function animate() {
        if (isAlreadyStats) {
            stats.update();
        }
    }
}


export { GUIStats }