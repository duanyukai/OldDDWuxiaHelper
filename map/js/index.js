/**
 * layer with markers
 */
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




//新建文士icon
var mobaoIcon = L.icon({
    iconUrl: 'assets/img/icon/mobao-marker.png',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -6]
});

var mobaoLargeIcon = L.divIcon({
    iconSize: [96,36],
    html: "<div class='mobao-div-icon'><img src='assets/img/icon/mobao-marker.png' />哈啊哈哈哈哈哈哈哈哈</div>"
});


$(function(){
    var map, tileLayer;
    var mobaoLayerGroup;
    var layers;
    function init(mapId){
        var minZoom = 2;
        var maxZoom = 5;
        var img = [
            7936, //原图宽度
            4096  //原图高度
        ];

        //创建地图
        map = L.map(mapId, {
            minZoom: minZoom,
            maxZoom: maxZoom,
            attributionControl: false
        });

        var rc = new L.RasterCoords(map, img);

        //设置查看的位置
        map.setView(rc.unproject([3968, 2048]), 4);


        //添加图层
        layers = {
//                'Polygon': layerPolygon(map, rc),
//                'Countries': layerCountries(map, rc),
//             'Bounds': layerBounds(map, rc, img),
            "墨宝": layerMobao(map, rc),
//                'Info': layerGeo(map, rc)
        };

        L.control.layers({}, layers).addTo(map);

        tileLayer = L.tileLayer('assets/img/map/hangzhou/raster/{z}/{x}/{y}.png', {
            noWrap: true,
            attribution: 'Map'
        });
        tileLayer.addTo(map);
    }

    init('map');

    //添加事件监听器
    $("#city-btn-div").find("button").click(function(){
        var city = $(this).attr("name");
        console.log(city);
        //更改图层
        tileLayer.setUrl("assets/img/map/" + city + "/raster/{z}/{x}/{y}.png");
        $("#city-picker").html($(this).text() + " <span class='caret'></span>");
    });

    //防止mega menu关闭 TODO
    $(document).on('click', '.yamm .dropdown-menu', function(e) {
        e.stopPropagation();
    });

    //地图缩放事件
    map.on('zoomend', function(){
        var currentZoom = map.getZoom();
        if(currentZoom >= 4){
            console.log(layers["墨宝"].getLayers());
            layers["墨宝"].getLayers().forEach(function(item){
                item.setIcon(mobaoLargeIcon);
                // item.getContainer().innerHTML = "hahaha";
            });
        }else{
            layers["墨宝"].getLayers().forEach(function(item){
                item.setIcon(mobaoIcon);
            });
        }
    });
});


function layerMobao(map, rc){
    var markers = [];

    var markerLayer = L.layerGroup();
    mobaoPos.hangzhou.forEach(function(viewpoint){
        viewpoint.condition.forEach(function(cluster){
            cluster.location.forEach(function(item){
                markerLayer.addLayer(
                    L.marker(rc.unproject(gameToMap(mapPos.hangzhou, [item[1], item[2]])), {icon: mobaoIcon})
                        .bindPopup(item[0] + "(" + item[1] + ", " + item[2] + ")")
                );
                console.log(item[0] + "(" + item[1] + ", " + item[2] + ")");
            })
        });
    });

    map.addLayer(markerLayer);
    return markerLayer;
}

