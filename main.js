var http = require("http")
var fs = require("fs")
var cheerio = require("cheerio")
var iconv = require("iconv-lite")
var path = require('path')
var urlList = JSON.parse(fs.readFileSync('list.json', 'utf8'))
var filepath = ''
function getContent(chapter,cnt) {
    console.log(chapter.link)
    http.get(chapter.link, function(res) {
        var chunks = []
        res.on('data', function(chunk) {
            chunks.push(chunk)
        })
        res.on('end', function() {
            var html = iconv.decode(Buffer.concat(chunks), 'gb2312')
            var $ = cheerio.load(html, {
                decodeEntities: false
            })
            var content = ($(".txt").text()).replace(/\&nbsp;/g, '')
            var filename = '' + cnt.toString() + '.md'

            if (fs.existsSync(filename)) {
                fs.appendFileSync(filename, '### ' + chapter.title)
                fs.appendFileSync(filename, content)
            } else {
                fs.writeFileSync(filename, '### ' + chapter.title)
                fs.appendFileSync(filename, content)
            }
            fs.rename(filename,filepath + '\\' + filename,function(err){
                if(err){
                    console.log('something wrong' + err)
                }
                console.log('done')
            })

        })
    }).on('error', function() {
        console.log("爬取" + chapter.link + "链接出错！")
    })
}
if(!fs.exists(filepath)){
    fs.mkdir(filepath)
}
// console.log(urlList.length)
for (let i = 0; i < urlList.length; i++) {
    console.log(urlList[i])
    getContent(urlList[i],i)
}