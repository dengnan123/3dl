var GUIListInit = function (gui, GUIListInitData, folder) {
    const data = GUIListInitData;
    const folders = [];
    initGUI();


    function initGUI() {
        var numData = {
            uniform: { value: data.defaultCount }, infos:
                [{ displayName: "数目", order: 9999, max: data.maxCount, isSlider: true, delta: 1 }]
        };
        gui.addValue(numData, folder);
        for (let index = 0; index < data.defaultCount; index++) {
            let sonFolder = gui.addFolder({ folderName: `第${index}个`, isOpen: true, parent: folder });
            data.data[index].initGUI(gui, sonFolder);
            folders.push(sonFolder);
        }
        for (let index = data.defaultCount; index < data.maxCount; index++) {
            let sonFolder = gui.addFolder({ folderName: `第${index}个`, isOpen: true, parent: folder, isHide: true });
            data.data[index].initGUI(gui, sonFolder);
            folders.push(sonFolder);
        }


        function onNumChange(value) {

        }

    }

}

var GUIListInitData = function (data, defaultcount, maxcount) {
    this.data = data;
    this.defaultCount = defaultcount;
    this.maxCount = maxcount;
}

export { GUIListInitData, GUIListInit }