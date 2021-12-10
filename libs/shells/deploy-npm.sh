
#!/usr/bin/env bash

# 切换到npm源
npm config set registry=http://registry.npmjs.org


npm publish


# 发布成功后 切换到淘宝源
npm config set registry=https://registry.npm.taobao.org