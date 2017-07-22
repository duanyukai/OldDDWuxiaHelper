var mapPos = {
    hangzhou: [
        [
            [3536, 3026],   //游戏坐标
            [5414, 1056]    //图片坐标
        ],
        [
            [1266, 311],    //游戏坐标
            [3010, 3933]    //图片坐标
        ]
    ],
    jiuhua: [
        [
            [3536, 3026],   //游戏坐标
            [5414, 1056]    //图片坐标
        ],
        [
            [1266, 311],    //游戏坐标
            [3010, 3933]    //图片坐标
        ]
    ]
};

var mobaoPos = {
    hangzhou: [
        {
            name: "杭州城",
            description: "",
            manuLevel: 1,
            roleLevel: 12,
            time: "白昼",
            weather: "晴天",
            condition: [
                {
                    type: "云游揽胜",
                    location: [
                        {name: "商道日晷", x: 2010, y: 1010},
                        {name: "永兴塔顶", x: 2182, y: 472},
                        {name: "擂台铜锣", x: 1855, y: 1068},
                        {name: "钱塘城门", x: 2010, y: 1329}
                    ]
                },
                {
                    type: "悠游趣闻",
                    location: [
                        {name: "花船木伞", x: 1954, y: 721},
                        {name: "藏经典籍", x: 2226, y: 674},
                        {name: "永兴遗珠", x: 2348, y: 567},
                        {name: "商行古玩", x: 1853, y: 465}
                    ]
                }
            ]
        },
        {
            name: "一醉轩",
            description: "",
            manuLevel: 1,
            roleLevel: 14,
            time: "戌时或亥时",
            weather: "晴天",
            condition: [
                {
                    type: "悠游趣闻",
                    location: [
                        {name: "石桌茶点", x: 2738, y: 2070},
                        {name: "廊道古琴", x: 2831, y: 2197},
                        {name: "庭院睡莲", x: 2715, y: 2084},
                        {name: "山石文玩", x: 2671, y: 2083}
                    ]
                },
                {
                    type: "悠游趣闻",
                    location: [
                        {name: "范仲淹", x: 2788, y: 2068},
                        {name: "柳永",  x: 2757,y: 2088},
                        {name: "梅尧臣", x: 2740, y: 2131},
                        {name: "晏殊",  x: 2732,y: 2179}
                    ]
                }
            ]
        }
    ]
};

function gameToMap(arr, pos){
    var gw = arr[0][0][0] - arr[1][0][0];
    var gh = arr[0][0][1] - arr[1][0][1];
    var pw = arr[0][1][0] - arr[1][1][0];
    var ph = arr[0][1][1] - arr[1][1][1];
    var x = (pos[0] - arr[0][0][0]) / gw * pw + arr[0][1][0];
    var y = (pos[1] - arr[0][0][1]) / gh * ph + arr[0][1][1];
    console.log(gw, gh, pw, ph ,x, y);

    return [x, y];
}

function mapTogame(){

}