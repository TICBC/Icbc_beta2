export default ($scope, $rootScope, qService, TransactionRes, ToasterTool, BASE_URL,$interval) => {
	'ngInject';
    //	$state.go("in.result");
	//交易数字统计 start
    var total_money=0;
    var total_times = 0;
    var max_n = 0;
    //交易数字统计 end
	

    // 定时查询ById   -- start
    // var ids = [1,2,3,4,5,6,7,8,9,10,11,12];
    var value;
    var id_cur,i=0,n=0;
    var equ=0,act=0,tru=0;
    var arrayItem = new Array();
    var arrayLength = 8;
    var timer = $interval(function () {
        // i = n%5;
        i++;
        n = i%120;

        getByIdLoop(n);
        
        
    }, 3000);
    function getByIdLoop(id) {
        // if (isNull($scope.params.value)) {
        //  ToasterTool.warning("输入不能为空");
        //  return;
        // }
        const params = {
            "id": id,
            //"value": $scope.params.value,
        }
        qService.httpGet(TransactionRes.TransactionInfo, params, {}).then((data) => {
        if (data.success) {
                //console.log("hehe");
            if (data.data == null) {
                ToasterTool.error("无结果");
                // $scope.items = null;
            } else {
                // [data.data];
                total_times++;
                total_money = total_money + data.data['txAmt'];
                if(data.data['txAmt'] > max_n){
                    max_n = data.data['txAmt'];
                }
                if(arrayItem.length < arrayLength){
                    arrayItem.push(data.data);
                }else{
                    for (var i = 0 ; i < arrayLength - 1; i++) {
                        arrayItem[i] = arrayItem[i+1];
                    }
                    arrayItem[arrayLength-1] = data.data;
                    value = data.data.txAmt
                    console.log(value)
                }
                

                $scope.items= angular.copy(arrayItem);
                $scope.Tmoney= angular.copy(total_money);
                $scope.Ttimes= angular.copy(total_times);
                $scope.MaxN= angular.copy(max_n);
                $scope.dan = angular.copy(data.data['txAmt']);
            }
        } else {
            ToasterTool.error("无结果");

            // $scope.items = null;
        }
        }, (err) => {
            ToasterTool.error("网络错误");
            // $scope.items = null;
        }).finally(() => {
            $rootScope.loading = false;
        });
    };
    
    $scope.$on('$destroy',function(){
        $interval.cancel(timer);
    })
    

    $scope.draw = () => {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        Highcharts.chart('container', {
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                // y = Math.random();
                                y = value;
                            series.addPoint([x, y], true, true);
                        }, 3000);
                    }
                }
            },
            title: {
                text: '实时交易'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 3000,
                            y: value
                        });
                    }
                    return data;
                }())
            }]
        });
    }
    $scope.draw();

    /////////// 定时查询ById  --end
};