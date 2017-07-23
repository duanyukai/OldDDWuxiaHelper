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
    cache: {
        name: null,
        mobaoData: {},
        translate: {},
        layers: {},
        // mobaoDetailedIcons: {}
    }
};

function customInitMap(city) {
    // 加载当前地图缓存数据 todo
    WuxiaMap.cache.name = city;
    WuxiaMap.cache.sizeInfo = mapPos[city];

    WuxiaMap.cache.mobaoData = mobaoPos[city];
}


//新建墨宝icon
var mobaoIcon = L.icon({
    iconUrl: 'img/icon/mobao-marker.png',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -6]
});



// var mobaoDetailedIcon = L.divIcon({
//     iconSize: [96,36],
//     html: "<div class='mobao-div-icon' style='background: rgba(0,0,0, 0.5); width: 300px; color: #fff;'><img src='img/icon/mobao-marker.png' />哈啊哈哈哈哈哈哈哈哈</div>"
// });

$(function(){
    var map, tileLayer;
    var mobaoLayerGroup;
    var layers;
    function init(mapId){

        // 初始化参数
        customInitMap("hangzhou");

        var minZoom = 3;
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
            attributionControl: false,
            maxBoundsViscosity: 1.0
        });

        //todo
        // WuxiaMap.cache.map = map;
        // WuxiaMap.cache.layers = layers;

        var rc = new L.RasterCoords(map, imgSize);

        // 设置查看的位置
        // map.setView(rc.unproject([3968, 2048]), 3);
        map.setView(rc.unproject(sizeInfo.initView), 3);

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
        tileLayer.addTo(map);
    }

    // 初始化地图
    init('map');

    // 添加事件监听器

    // 城市切换
    $("#city-btn-div button").click(function(){
        // 获取城市信息
        var city = $(this).attr("name");
        console.log(city);

        // 更新缓存
        customInitMap(city);

        // 更改图层
        tileLayer.setUrl("img/map/" + city + "/raster/{z}/{x}/{y}.png");
        $("#city-picker").html($(this).text() + " <span class='caret'></span>");

        // 更新Icon
        map.removeLayer(layers["mobao"]);

        layers["mobao"] = layerMobao(map, new L.RasterCoords(map, WuxiaMap.cache.sizeInfo.imgSize));
        map.addLayer(layers["mobao"]);

        // 更新图层显示状态
        // for(var i = 0; i < layers.length; i++){
        //     if(map.hasLayer(layers[i])){
        //
        //     }else{
        //
        //     }
        // }
    });

    // 显示图层切换
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

    //防止mega menu关闭 TODO
    $(document).on('click', '.yamm .dropdown-menu', function(e) {
        e.stopPropagation();
    });

    //地图缩放事件
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

