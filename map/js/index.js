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
        mobaoData: {},
        mobaoDetailedIcons: {}
    }
};

function customInitMap(city) {
    // 加载墨宝数据
    WuxiaMap.cache.mobaoData = mobaoPos[city]; // todo
    // var mobaoData = WuxiaMap.cache.mobaoData;

    // // 缓存墨宝Icon
    // mobaoData.forEach(function(viewpoint){
    //     viewpoint.condition.forEach(function(cluster){
    //         cluster.location.forEach(function(item){
    //             // WuxiaMap.cache.mobaoDetailedIcons[]
    //         })
    //     });
    // });


    // WuxiaMap.cache.mobaoIcons =
}


//新建墨宝icon
var mobaoIcon = L.icon({
    iconUrl: 'img/icon/mobao-marker.png',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -6]
});



var mobaoDetailedIcon = L.divIcon({
    iconSize: [96,36],
    html: "<div class='mobao-div-icon' style='background: rgba(0,0,0, 0.5); width: 300px; color: #fff;'><img src='img/icon/mobao-marker.png' />哈啊哈哈哈哈哈哈哈哈</div>"
});


$(function(){
    var map, tileLayer;
    var mobaoLayerGroup;
    var layers;
    function init(mapId){
        var minZoom = 3;
        var maxZoom = 7;
        var maxMativeZoom = 5;

        // todo 获取地图
        var img = [
            7936, //原图宽度
            4096  //原图高度
        ];

        //创建地图
        map = L.map(mapId, {
            minZoom: minZoom,
            maxZoom: maxZoom,
            attributionControl: false,
            maxBoundsViscosity: 1.0
        });

        var rc = new L.RasterCoords(map, img);

        //设置查看的位置
        map.setView(rc.unproject([3968, 2048]), 3);


        //添加图层
        layers = {
//                'Polygon': layerPolygon(map, rc),
//                'Countries': layerCountries(map, rc),
//             'Bounds': layerBounds(map, rc, img),
            "mobao": layerMobao(map, rc),
//                'Info': layerGeo(map, rc)
        };

        L.control.layers({}, layers).addTo(map);

        tileLayer = L.tileLayer('img/map/hangzhou/raster/{z}/{x}/{y}.png', {
            noWrap: true,
            maxZoom: maxZoom,
            maxNativeZoom: maxMativeZoom,
            attribution: 'Map'
        });
        tileLayer.addTo(map);
    }

    // 初始化地图
    init('map');

    //添加事件监听器
    $("#city-btn-div").find("button").click(function(){
        var city = $(this).attr("name");
        console.log(city);
        //更改图层
        tileLayer.setUrl("img/map/" + city + "/raster/{z}/{x}/{y}.png");
        $("#city-picker").html($(this).text() + " <span class='caret'></span>");
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
                console.log(item.detailedIcon);
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
    //杭州的每幅画
    mobaoPos.hangzhou.forEach(function(viewpoint){
        viewpoint.condition.forEach(function(cluster){
            //每幅画的每个点
            cluster.location.forEach(function(item){
                // 添加详细Icon
                var marker = L.marker(rc.unproject(gameToMap(mapPos.hangzhou, [item.x, item.y])), {icon: mobaoIcon});
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

                console.log(item.name + "(" + item.x + ", " + item.y + ")");
            })
        });
    });

    map.addLayer(markerLayer);
    return markerLayer;
}

