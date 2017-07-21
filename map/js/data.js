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
                        ["商道日晷", 2010, 1010],
                        ["永兴塔顶", 2182, 472],
                        ["擂台铜锣", 1855, 1068],
                        ["钱塘城门", 2010, 1329]
                    ]
                },
                {
                    type: "悠游趣闻",
                    location: [
                        ["花船木伞", 1954, 721],
                        ["藏经典籍", 2226, 674],
                        ["永兴遗珠", 2348, 567],
                        ["商行古玩", 1853, 465]
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
                        ["石桌茶点", 2738, 2070],
                        ["廊道古琴", 2831, 2197],
                        ["庭院睡莲", 2715, 2084],
                        ["山石文玩", 2671, 2083]
                    ]
                },
                {
                    type: "悠游趣闻",
                    location: [
                        ["范仲淹", 2788, 2068],
                        ["柳永",  2757, 2088],
                        ["梅尧臣", 2740, 2131],
                        ["晏殊",  2732, 2179]
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