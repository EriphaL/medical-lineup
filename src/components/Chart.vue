<template>
  <div id="chart-view"></div>
</template>

<script>
import { Chart } from "@antv/g2";
import json from '../assets/data/chart_province_indexation.json';

export default {
  methods: {},
  mounted() {
    const data = JSON.parse(JSON.stringify(json));
    const provinces = data.map((el) => el["省市"]);
    // 查找最大值
    function findTop3() {
      let index_copy = data.map((el, index) => {
        return {
          index: index,
          indexation: el["改革指数"],
          policyRecords: el["政策发布数"],
        };
      });
      index_copy.sort((a, b) => b.indexation - a.indexation);
      console.log(index_copy);
      return index_copy;
      // let maxValue = 0;
      // let maxObj = null;
      // data.forEach((obj) => {
      //   if (obj['改革指数'] > maxValue) {
      //     maxValue = obj.value;
      //     maxObj = obj;
      //   }
      // });
      // return maxObj;
    }

    console.log("provinces", provinces);
    const chart = new Chart({
      container: "chart-view",
      autoFit: true,
      height: 550,
    });
    chart.data(data);

    chart.scale({
      政策发布数: {
        min: 0,
        max: 60,
      },
      改革指数: {
        min: 0,
        max: 1200,
      },
      省市: {
        type: "cat",
        //   tickCount:34
        ticks: provinces,
      },
    });
    chart.legend({
      // offsetY:,

      custom: true,
      items: [
        {
          value: "东北",
          name: "东北",
          marker: { symbol: "square", style: { fill: "#44B36E", r: 5 } },
        },
        {
          value: "西北",
          name: "西北",
          marker: { symbol: "square", style: { fill: "#C00000", r: 5 } },
        },
        {
          value: "华北",
          name: "华北",
          marker: { symbol: "square", style: { fill: "#FDE11C", r: 5 } },
        },
        {
          value: "华东",
          name: "华东",
          marker: { symbol: "square", style: { fill: "#268BC5", r: 5 } },
        },
        {
          value: "华中",
          name: "华中",
          marker: { symbol: "square", style: { fill: "#FF5702", r: 5 } },
        },
        {
          value: "华南",
          name: "华南",
          marker: { symbol: "square", style: { fill: "#9C7822", r: 5 } },
        },
        {
          value: "西南",
          name: "西南",
          marker: { symbol: "square", style: { fill: "#7030A0", r: 5 } },
        },
        {
          value: "政策发布数",
          name: "政策发布数",
          marker: {
            symbol: "hyphen",
            style: { stroke: "#fdae6b", r: 5, lineWidth: 3 },
          },
        },
      ],
    });
    chart.axis("政策发布数", {
      grid: null,
      title: {
        style: {
          // fill: "#fdae6b",/
        },
        // failed
        // formatter:(value)=>{
        //   return value.split("").join('\n')
        // }
      },
      label: {
        style: {
          // fill: "#fdae6b",
        },
      },
    });
    chart.axis("改革指数", {
      title: {},
    });
    chart.axis("省市", {
      // title:null

      label: {
        //     textAlign: 'center', // 文本对齐方向，可取值为： start middle end
        //   fill: '#404040', // 文本的颜色
        //   fontSize: '12', // 文本大小
        //   fontWeight: 'bold', // 文本粗细
        //   rotate: 30 * Math.PI / 180, // 文本旋转 30 度，需要将 30 度转化为弧度，2.3.0 及以上版本只支持弧度设置
        //   textBaseline: 'top', // 文本基准线，可取 top middle bottom，默认为middle
        style: {
          // fill: "red", //success 字体颜色
          // textAlign: 'end',
          textBaseline: "top", //竖直文本对齐方式  文本基准线，可取 top middle bottom，默认为middle
          // 'writing-mode': 'vertical-lr',
        },
        formatter: (value) => {
          // let arr = value.split("")
          // // let len = 15 - arr.length
          // let blankArr = new Array(15 - arr.length)
          // blankArr.fill('')
          // let res = arr.concat(blankArr)
          // res.join("\n")
          // console.log('arr',res)
          // return res;

          let blankArr = new Array(10 - value.length);
          let res = value.split("").concat(blankArr).join("\n");
          // console.log("res", res);
          return res;
        },
        offset: 10,
      },
    });

    chart.tooltip({
      shared: true,
    });
    chart
      .interval() //柱状图
      .position("省市*改革指数")
      .color("所属地区", [
        "#44B36E",
        "#C00000",
        "#FDE11C",
        "#268BC5",
        "#FF5702",
        "#9C7822",
        "#7030A0",
      ]);

    chart
      .line() //折线
      .position("省市*政策发布数")
      .color("#1F9690")
      .size(3);
    // .shape('smooth');
    chart
      .point() //tooltip点
      .position("省市*政策发布数")
      .color("#1F9690")
      .size(3)
      .shape("circle");

    // chart.annotation().text({
    //   position() {
    //     const obj = findMax();
    //     return [obj.time, obj.value];
    //   },
    //   content: "最大值",
    // });

    // top 1 2 3
    chart.annotation().text({
      position() {
        // const index1 = data.findIndex((el) => el["改革指数"] == 1008.6);
        const index1 = findTop3()[0].index;
        const obj = data[index1];
        console.log("position", obj["省市"], obj["改革指数"]);
        return [obj["省市"], obj["改革指数"]];
      },
      content: "top1",
      offsetX: -25,
      offsetY: -25,
      style: {
        fill: "#FECE38",
        fontSize: 30,
        fontWeight: "500",
        fontStyle: "italic",
        shadowOffsetX: "20",
        shadowColor: "2F9E98",
      },
    });
    chart.annotation().text({
      position() {
        // const index1 = data.findIndex((el) => el["省市"] == "黑龙江省");
        const index1 = findTop3()[1].index;
        const obj = data[index1];
        console.log("position", obj["省市"], obj["改革指数"]);
        return [obj["省市"], obj["改革指数"]];
      },
      content: "top2",
      offsetX: -25,
      offsetY: -25,
      style: {
        fill: "#FECE38",
        fontSize: 30,
        fontWeight: "500",
        fontStyle: "italic",
        shadowOffsetX: "20",
        shadowColor: "2F9E98",
      },
    });
    chart.annotation().text({
      position() {
        // const index1 = data.findIndex((el) => el["省市"] == "安徽省");
        const index1 = findTop3()[2].index;
        const obj = data[index1];
        console.log("position", obj["省市"], obj["改革指数"]);
        return [obj["省市"], obj["改革指数"]];
      },
      content: "top3",
      offsetX: -25,
      offsetY: -25,
      style: {
        fill: "#FECE38",
        fontSize: 30,
        fontWeight: "500",
        fontStyle: "italic",
        shadowOffsetX: "20",
        shadowColor: "2F9E98",
      },
    });

    chart.annotation().text({
      top: true,
      position: ["吉林省", "min"],
      content: "东北",
      style: {
        //fill: "#c0c0c0",
        fontSize: 12,
        fontWeight: "300",
        textAlign: "center",
      },
      // offsetX: -10,
      offsetY: 120,
      // rotate: Math.PI * -0.5,
    });
    chart.annotation().text({
      top: true,
      position: ["宁夏回族自治区", "min"],
      content: "西北",
      style: {
        //fill: "#c0c0c0",
        fontSize: 12,
        fontWeight: "300",
        textAlign: "center",
      },
      offsetX: 40,
      offsetY: 120,
    });
    chart.annotation().text({
      top: true,
      position: ["北京市", "min"],
      content: "华北",
      style: {
        //fill: "#c0c0c0",
        fontSize: 12,
        fontWeight: "300",
        textAlign: "center",
      },
      offsetY: 120,
    });
    chart.annotation().text({
      top: true,
      position: ["安徽省", "min"],
      content: "华东",
      style: {
        //fill: "#c0c0c0",
        fontSize: 12,
        fontWeight: "300",
        textAlign: "center",
      },
      offsetY: 120,
    });
    chart.annotation().text({
      top: true,
      position: ["湖北省", "min"],
      content: "华中",
      style: {
        //fill: "#c0c0c0",
        fontSizshie: 12,
        fontWeight: "300",
        textAlign: "center",
      },
      offsetY: 120,
    });
    chart.annotation().text({
      top: true,
      position: ["广东省", "min"],
      content: "华南",
      style: {
        //fill: "#c0c0c0",
        fontSizshie: 12,
        fontWeight: "300",
        textAlign: "center",
      },
      offsetY: 120,
    });
    chart.annotation().text({
      top: true,
      position: ["四川省", "min"],
      content: "西南",
      style: {
        //fill: "#c0c0c0",
        fontSizshie: 12,
        fontWeight: "300",
        textAlign: "center",
      },
      offsetY: 120,
    });

    // chart.annotation().line({
    //   start: ["-20%", "33.2%"],
    //   end: ["100%", "33.2%"],
    //   style: {
    //     stroke: "#c0c0c0",
    //     lineDash: [2, 2],
    //   },
    // });
    // chart.annotation().line({
    //   start: ["-20%", "66.8%"],
    //   end: ["100%", "66.8%"],
    //   style: {
    //     stroke: "#c0c0c0",
    //     lineDash: [2, 2],
    //   },
    // });

    chart.interaction("active-region");
    chart.removeInteraction("legend-filter"); // 自定义图例，移除默认的分类图例筛选交互
    chart.render();
  },
};
</script>

<style lang="scss"></style>
