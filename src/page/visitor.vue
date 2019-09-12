<template>
    <div>
      <div class="visitorpie">
        <div id="visitorpie" class="" style="width: 800px;height:400px;"></div>
      </div>
      <my-loading :is-loading="loading"/>
    </div>
</template>

<script>
    import api from '../api'
    import echarts from 'echarts'
    import myLoading from "../components/loading";
    export default {
        name: "visitor",
        data () {
          return {
              loading: true,
              pieData: {}
          }
        },
        mounted () {
            this.myChart = echarts.init(document.getElementById('visitorpie'))
            this.init()
        },
        methods: {
          async init () {
              const res = await api.getUserCity()
              this.loading = false
              if (res.data.status == 1) {
                  this.pieData = res.data.user_city;
                  this.getCharts()
              }else{
                  throw new Error(res)
              }
          },
            getCharts () {
                const option = {
                    title : {
                        text: '用户来源分布',
                        x:'center'
                    },
                    color : ['#749f83', '#ca8622','#bda29a','#546570','#c4ccd3'],
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {
                                show: true,
                                type: ['pie', 'funnel']
                            },
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    grid: [
                        {top: '20%', left: '55%', width: '40%', height: '40%'},
                        ],
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['北京','上海','深圳','杭州','其他']
                    },
                    calculable : true,
                    xAxis: {
                        data: ['北京','上海','深圳','杭州','其他']
                    },
                    yAxis: {

                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '50%',
                            center: ['20%', '50%'],
                            data:[
                                {value:this.pieData.beijing, name:'北京'},
                                {value:this.pieData.shanghai, name:'上海'},
                                {value:this.pieData.shenzhen, name:'深圳'},
                                {value:this.pieData.hangzhou, name:'杭州'},
                                {value:this.pieData.qita, name:'其他'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        },
                        {
                            name: '访问来源',
                            type: 'bar',
                            // radius : [30, 110],
                            // center : ['75%', '50%'],
                            data:[
                                {value:this.pieData.beijing, name:'北京'},
                                {value:this.pieData.shanghai, name:'上海'},
                                {value:this.pieData.shenzhen, name:'深圳'},
                                {value:this.pieData.hangzhou, name:'杭州'},
                                {value:this.pieData.qita, name:'其他'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                normal: {
                                    //每根柱子颜色设置
                                    color: function (params) {
                                        let colorList = [
                                            '#749f83',  '#ca8622', '#bda29a', '#546570', '#c4ccd3'
                                        ];
                                        return colorList[params.dataIndex];
                                    }
                                }
                            }
                        }
                    ]
                }
                this.myChart.setOption(option);
            }
        },
        components: {
            myLoading
        },
    }
</script>

<style scoped>
  .visitorpie{
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
</style>
