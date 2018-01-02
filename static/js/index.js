
var router = function(event, page) {
    //路由函数
    if (event.target.className.indexOf('active') == -1) {    
        switchPage(page)
        // pushState(page, 'switch')
        // toggleMenu()
    }
}

var play = function(event) {
    if (event.target.className.indexOf('pause') == -1) {
        player.player.play()
    } else {
        player.player.pause()
    }
    toggleClass(event.target, 'pause')
}

var toggleMenu = function() {
    var menu = e('.item-list')
    toggleClass(menu, 'active')
}

var switchPage = function(page) {
    //切换页面
    var body = e('.main')
    var target = 0
    var elements = es('.item')
    for (let i = 0; i < pageList.length; i++) {
        if (page === pageList[i]) {
            body.innerHTML = pageFunction[page]()
        }
        elements[i].classList.add('active')
    }    
    for (let i = 0; i < elements.length; i++) {
        removeClass(elements[i], 'active')
    }
    
}

var pageList = ['list', 'find', 'detail']

var pageFunction = {
    'list': function() {
        var template = 
        `<div class="music-list">`
        var t = function(index, music) {
            var item = 
            `
            <div class="music-item">
                <img src="${music.imgSrc}" class="music-img" />
                <span class="music-name">${index + 1} ${music.musicName}</span>
                <span class="del-icon"></span>
            </div>
            `
            return item
        }
        var musicData = JSON.parse(localStorage.musicData)
        for (let i = 0; i < musicData.length; i++) {
            template += t(i, musicData[i])
        }
        return template + `</div>`

    },
    'find': function() {

    },
    'detail': function() {

    }
}

var pushState = function(page, target) {
    // 切换地址栏信息和添加历史信息
    var url = ''
    if (page !== 'index') {
        url = 'index.html?page=' + page
    } else {
        url = 'index.html'
    }
    var state = {
        title: document.title
    }
    if (target == 'switch') {
        history.pushState(state, 'title', url)
    } else if (target == 'init'){
        history.replaceState(state, 'title', url)
    }
}

var initApp = function() {
    // 根据地址栏的参数来显示不同的页面
    var query = location.search
    var [k, v] = query.slice(1).split('=')
    var validPages = ['news', 'details']
    if (k == 'page') {
        for (let i = 0; i < validPages.length; i++) {
            if (validPages[i] == v) {
                switchPage(validPages[i])
                pushState(validPages[i], 'init')
            }
        }
    } else {
        switchPage('index')
        pushState('index', 'init')
    }
}

var _main = function() {
    var musicData = [
        {
            'musicSrc': './static/music/時を刻む唄.mp3',
            'imgSrc': './static/music/時を刻む唄.png',
            'musicName': '時を刻む唄 - Lia',
        },
        {
            'musicSrc': './static/music/Ryoko-Refrain.mp3',
            'imgSrc': './static/music/Ryoko-Refrain.png',
            'musicName': 'Anan Ryoko-Refrain',
        }
    ]
    localStorage.musicData = JSON.stringify(musicData)
    window.player = new Player()
    player.player.src = musicData[0].musicSrc
    e('.music-img').src = musicData[0].imgSrc
    e('.music-name p').innerText = musicData[0].musicName
    player.player.addEventListener("canplay", () => {
        e('.end').innerText = player.transformTime(player.player.duration)
    })
    player.player.addEventListener('play', () => {
        e('.start').innerText =  player.transformTime(player.player.currentTime)
        setInterval(() => {
            e('.start').innerText = player.transformTime(player.player.currentTime)
            e('.now').style.width = (player.player.currentTime / player.player.duration).toFixed(3)*100 + '%'
          }, 1000);
    })
    
    // initApp()
    // window.addEventListener("popstate", function(e) {
    //     var state = e.state;
    //     // state 就是 pushState 的第一个参数
    //     initApp()
    //     document.title = state.title
    // })
    // initMap()
}

_main()