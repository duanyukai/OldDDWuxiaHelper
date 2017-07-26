//绘制边界位置的marker，测试用
function layerBounds(map, rc, img){
    // set marker at the image bound edges
    var layerBounds = L.layerGroup([
        L.marker(rc.unproject([0, 0])).bindPopup('[0,0]'),
        L.marker(rc.unproject(img)).bindPopup(JSON.stringify(img)),
        L.marker(rc.unproject(gameToMap(mapPos.hangzhou, [1854, 464])), {icon: mobaoIcon}).bindPopup('[1854,464]'),
        L.marker(rc.unproject(gameToMap(mapPos.hangzhou, [2002, 3539])), {icon: mobaoIcon}).bindPopup('[1854,464]')
    ]);
    map.addLayer(layerBounds);


    // set markers on click events in the map
    map.on('click', function(event){
        // to obtain raster coordinates from the map use `project`
        var coord = rc.project(event.latlng);
        // to set a marker, ... in raster coordinates in the map use `unproject`
        var marker = L.marker(rc.unproject(coord))
            .addTo(layerBounds);
        marker.bindPopup('[' + Math.floor(coord.x) + ',' + Math.floor(coord.y) + ']')
            .openPopup()
    });

    return layerBounds
}

//存储全局属性
var WuxiaMap = {
    map: null,
    tileLayer: null,
    all: {
        mobaoData: mobaoPos
    },
    cache: {
        name: null,
        rc: null,
        mobaoData: {},
        translate: {},
        layers: {},
        // mobaoDetailedIcons: {}
    },
    search: {
        mobao: []
    }
};

// 初始化搜索
(function initSearch(){
    for(var key in mobaoPos){
        if(mobaoPos.hasOwnProperty(key)){
            var temp = mobaoPos[key];
            temp.forEach(function(t){
                t["city"] = key;
            });
            WuxiaMap.search.mobao = WuxiaMap.search.mobao.concat(temp);
        }
    }
})();

function customInitMap(city) {
    // 加载当前地图缓存数据 todo
    WuxiaMap.cache.name = city;
    WuxiaMap.cache.sizeInfo = mapPos[city];
    WuxiaMap.cache.mobaoData = mobaoPos[city];
}


function changeMap(city, view) {
    // 更新缓存 todo

    customInitMap(city);
    var map = WuxiaMap.map;
    var tileLayer = WuxiaMap.tileLayer;
    var layers = WuxiaMap.cache.layers;
    var rc = new L.RasterCoords(map, WuxiaMap.cache.sizeInfo.imgSize);

    // 更改图层
    tileLayer.setUrl("img/map/" + city + "/raster/{z}/{x}/{y}.png");
    $("#city-picker").html($(this).text() + " <span class='caret'></span>");

    // 更新Icon
    map.removeLayer(layers["mobao"]);

    // 设置View
    if (view !== undefined) {
        map.setView(view, 4); // todo 层级
    } else {
        // 默认view
        map.setView(rc.unproject(WuxiaMap.cache.sizeInfo.initView), 3);
    }

    // 更新图层
    layers["mobao"] = layerMobao(map, rc);
    map.addLayer(layers["mobao"]);

    // 更新图层显示状态 todo
    // for(var i = 0; i < layers.length; i++){
    //     if(map.hasLayer(layers[i])){
    //
    //     }else{
    //
    //     }
    // }
}

//新建墨宝icon
var mobaoIcon = L.icon({
    iconUrl: 'img/icon/mobao-marker.png',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -6]
});


// 开始加载
$(function(){
    var map, tileLayer;
    var layers;
    function init(mapId){

        // 初始化参数
        customInitMap("hangzhou");

        var minZoom = 1;
        var maxZoom = 7;
        var maxMativeZoom = 5;

        // 获取地图大小
        var sizeInfo = WuxiaMap.cache.sizeInfo;
        // var imgSize = [
        //     // 7936, //原图宽度
        //     // 4096  //原图高度
        // ];
        var imgSize = sizeInfo.imgSize;

        // 创建地图
        map = L.map(mapId, {
            minZoom: minZoom,
            maxZoom: maxZoom,
            wheelPxPerZoomLevel: 90,
            attributionControl: false,
            maxBoundsViscosity: 1.0
        });

        WuxiaMap.map = map;

        //todo
        // WuxiaMap.cache.map = map;
        // WuxiaMap.cache.layers = layers;

        var rc = new L.RasterCoords(map, imgSize);
        WuxiaMap.cache.rc = rc;

        // 设置查看的位置
        // map.setView(rc.unproject([3968, 2048]), 3);
        map.setView(rc.unproject(sizeInfo.initView), 4);

        // 添加图层

        // 缓存图层
        // mobaoLayer = layerMobao(map, rc);
        // WuxiaMap.cache.layers["mobao"] = mobaoLayer;
        // map.addLayer(mobaoLayer);

        layers = {
//                'Polygon': layerPolygon(map, rc),
//                'Countries': layerCountries(map, rc),
//             'Bounds': layerBounds(map, rc, img),
            "mobao": layerMobao(map, rc),
//                'Info': layerGeo(map, rc)
        };
        WuxiaMap.cache.layers = layers;

        map.addLayer(layers["mobao"]);


        // 图层控制
        // L.control.layers({}, layers).addTo(map);

        // 默认加载杭州地图
        tileLayer = L.tileLayer('img/map/' + WuxiaMap.cache.name + '/raster/{z}/{x}/{y}.png', {
            noWrap: true,
            maxZoom: maxZoom,
            maxNativeZoom: maxMativeZoom,
            attribution: 'Map'
        });
        WuxiaMap.tileLayer = tileLayer;
        tileLayer.addTo(map);
    }

    // 初始化地图
    init('map');

    // 添加事件监听器

    // 城市切换
    $("#city-btn-div").find("button").click(function(){
        // 获取城市信息
        var city = $(this).attr("name");
        console.log(city);
        changeMap(city);
    });

    // 显示图层切换 todo bug
    $("#layer-selector").find("button").click(function () {
        var type =  $(this).attr("data-layer");
        console.log($(this).attr("data-layer"));
        $(this).toggleClass("active");
        if(map.hasLayer(layers[type])){
            console.log(layers);

            map.removeLayer(layers[type]);
            console.log(layers);

        }else{
            console.log("233");
            map.addLayer(layers[type]);
        }
    });

    // 搜索按钮

    var options = {
        shouldSort: true,
        // threshold: 0.0,
        keys: ["name", "description", "pinyin", "condition.location.name"]
    };
    // var fuse = new Fuse(WuxiaMap.search.mobao, options);

    var delayTimer;
    $("#input-search").bind("keydown blur change", function(){
        clearTimeout(delayTimer);
        delayTimer = setTimeout(function(){

            console.log("搜索" + $("#input-search").val());
            var keyword = $("#input-search").val();

            // var result = fuse.search($("#input-search").val());

            // 自己编写的简单搜索
            var mobao = WuxiaMap.search.mobao;
            var result = [];
            for (var i = 0; i < mobao.length; i++) {
                if (mobao[i].city.indexOf(keyword) !== -1 ||
                    mobao[i].name.indexOf(keyword) !== -1 ||
                    mobao[i].description.indexOf(keyword) !== -1 ||
                    mobao[i].pinyin.indexOf(keyword) !== -1
                ) {
                    result.push(mobao[i]);
                }else{
                    for (var j = 0; j < mobao[i].condition.length; j++) {
                        for (var k = 0; k < mobao[i].condition[j].location.length; k++) {
                            if (mobao[i].condition[j].location[k].name.indexOf(keyword) !== -1) {
                                result.push(mobao[i]);
                                break;
                            }
                        }
                    }
                }
                // 仅搜索前10项
                if (result.length > 10)
                    break;
            }

            // console.log(WuxiaMap.search.mobao);
            $("#search-result").find("ul").html((function () {
                var list = [];
                for (var i = 0; i < result.length; i++) {
                    var li = $("<li></li>");
                    li.data("map-info", result[i]);
                    var spans = "";
                    spans += "<span>" + result[i].name + "</span>";
                    for (var j = 0; j < result[i].condition.length; j++) {
                        for (var k = 0; k < result[i].condition[j].location.length; k++) {
                            spans += "<span>" + result[i].condition[j].location[k].name + "</span>";
                        }
                    }
                    li.html(spans);
                    list.push(li);

                }
                return list;
            })());

            console.log(result);
        }, 500);

    });

    // 搜索结果点击事件
    $("#search-result").on("click", "li", function () {
        console.log($(this).data("map-info"));
        // 切换地图及视角
        var town = $(this).data("map-info");
        // 计算显示位置，简单求平均
        var sumX = 0, sumY = 0, count = 0;
        for (var i = 0; i < town.condition.length; i++) {
            for (var j = 0; j < town.condition[i].location.length; j++) {
                sumX += town.condition[i].location[j].x;
                sumY += town.condition[i].location[j].y;
                count++;
            }
        }
        var x = sumX / count;
        var y = sumY / count;
        var view = [x, y];

        console.log(view);

        if (town.city !== WuxiaMap.cache.name) {
            changeMap(town.city, WuxiaMap.cache.rc.unproject(gameToMap(WuxiaMap.cache.sizeInfo.correspond, view)), 5);
        } else {
            WuxiaMap.map.setView(WuxiaMap.cache.rc.unproject(gameToMap(WuxiaMap.cache.sizeInfo.correspond, view)), 5);
        }
    });


    //防止mega menu关闭 TODO
    $(document).on('click', '.yamm .dropdown-menu', function(e){
        e.stopPropagation();
    });

    // 地图缩放事件
    map.on('zoomend', function(){
        var currentZoom = map.getZoom();
        if(currentZoom >= 5){
            console.log(layers["mobao"].getLayers());
            layers["mobao"].getLayers().forEach(function(item){
                // 设置详细Icon
                // item.setIcon(mobaoDetailedIcon);
                item.setIcon(item.detailedIcon);
                // console.log(item.detailedIcon);
            });
        }else{
            layers["mobao"].getLayers().forEach(function(item){
                // 设置单图标Icon
                item.setIcon(mobaoIcon);
            });
        }
    });


});


// 初始化墨宝Icon
function layerMobao(map, rc){
    var markerLayer = L.layerGroup();
    //每幅画
    WuxiaMap.cache.mobaoData.forEach(function(viewpoint){
        viewpoint.condition.forEach(function(cluster){
            //每幅画的每个点
            cluster.location.forEach(function(item){
                // 添加详细Icon
                var marker = L.marker(rc.unproject(gameToMap(WuxiaMap.cache.sizeInfo.correspond, [item.x, item.y])), {icon: mobaoIcon});
                marker.bindPopup(item.name + "(" + item.x + ", " + item.y + ")");
                // 添加反查属性
                marker.detailedIcon = L.divIcon({
                    iconSize: [128,36],
                    iconAnchor: [18, 18],
                    html: "<div class='mobao-detailed-icon'><img src='img/icon/mobao-marker.png'/> <span>" +
                    item.name + " " + item.x + " " + item.y +
                    "</span></div>"
                });

                markerLayer.addLayer(marker);

                // console.log(item.name + "(" + item.x + ", " + item.y + ")");
            })
        });
    });

    // map.addLayer(markerLayer);
    return markerLayer;
}

