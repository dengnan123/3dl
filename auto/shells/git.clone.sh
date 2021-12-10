if [ ! -d "release" ]; then
    echo "release文件夹不存在"
    mkdir release
    cd release
    git clone git@agitlab.dfocus.co:customization/df-visual-big-screen-building-system.git
    cd df-visual-big-screen-building-system
    git checkout feature/dany/master
   
else
    echo 'release文件夹存在'
    cd release/df-visual-big-screen-building-system
    rm -rf ./df-visual-big-screen-building-system
    rm -rf ./dist
    git fetch --all
    git reset --hard feature/dany/master
fi


