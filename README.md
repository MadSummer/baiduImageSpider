# baiduImageSpider
这个项目主要用来爬取百度图片

# 使用方法
### 1. clone本项目到本地
### 2. 项目内打开命令行，运行npm i，安装依赖
### 3. 运行npm get 获取爬取关键词的列表，当然可以自己编辑result.json，保持格式与默认格式一致即可。
### 4. 运行 npm start，开始任务。

# 可用的npm命令

### 1. npm start
  开启任务
  
### 2. npm clean
清空images文件夹（***请及时转移已经下载的图片***）以及result.json中的爬取进度（pn）

### 3. npm get

从[百度风云榜][1]获取列表，本项目初衷是为了爬取一些明星图片，所以getKeywords.js里写死了地址，您可以根据自己的需求切换不同的分类，前提是要保持页面格式跟[百度风云榜人物分类][2]的列表一致。


  [1]: http://top.baidu.com/category?c=9&fr=topindex
  [2]: http://top.baidu.com/category?c=9&fr=topindex
