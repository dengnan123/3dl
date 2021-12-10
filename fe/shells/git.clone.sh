if [ ! -d "release" ]; then
    echo "release文件夹不存在"
    mkdir release
    cd release
    git clone git@agitlab.dfocus.co:customization/df-visual-big-screen-building-system.git
    cd df-visual-big-screen-building-system
    git checkout feature/dany/master
   
else
    echo 'release文件夹存在'
    rm -rf ./release
    mkdir release
    cd release
    git clone git@agitlab.dfocus.co:customization/df-visual-big-screen-building-system.git
    cd df-visual-big-screen-building-system
    git checkout feature/dany/master
    # cd release
    # rm -rf df-visual-big-screen-building-system
    # git clone git@agitlab.dfocus.co:customization/df-visual-big-screen-building-system.git
    # cd df-visual-big-screen-building-system
    # git checkout feature/dany/master
fi


