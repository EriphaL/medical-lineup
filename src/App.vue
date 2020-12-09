<template>
  <div id="app">
    <el-container>
      <el-header class="d-flex jc-center ai-center bg-primary b-shadow">
        <h1 class="flex-1">医保指数平台</h1>
        <el-button
          plain
          type="info"
          @click="chartDialogVisible = true"
          class="m-2"
          >报表<i class="el-icon-s-data el-icon--right"></i
        ></el-button>
        <el-button plain type="info" @click="edit" class="m-2"
          >权重方案调整<i class="el-icon-edit el-icon--right"></i
        ></el-button>
        <el-button plain type="info" @click="generatorImage" class="m-2"
          >导出左侧视图<i class="el-icon-download el-icon--right"></i
        ></el-button>
        <el-button plain type="info" @click="exportExcel" class="m-2"
          >导出右侧表格<i class="el-icon-download el-icon--right"></i
        ></el-button>
      </el-header>
      <el-main>
        <el-col :span="24" id="score" ref="score-img"> </el-col>
      </el-main>
      <FinalScore :tableData="res" v-model="res"></FinalScore>
    </el-container>
    <el-dialog :title="curProvince" :visible.sync="dialogTableVisible">
      <!-- curinfo 是对象的情况下-->
      <el-form label-width="120px" :model="curInfo">
        <el-form-item v-for="(val, key) in curInfo" :label="key" :key="key">
          <el-input
            v-model="curInfo[key]"
            :placeholder="curInfo[key]"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEditRowData">取 消</el-button>
        <el-button type="primary" @click="editRowData">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="权重方案调整"
      :visible.sync="weightBoxVisible"
      id="weightBox"
    >
      <el-row>
        <el-col :span="16">
          <el-table :data="initialWeight">
            <el-table-column
              prop="point"
              label="得分点"
              width="150"
            ></el-table-column>
            <el-table-column prop="weight" label="权重">
              <template slot-scope="scope">
                <div>
                  <el-slider v-model="scope.row.weight" :step="20" show-input>
                  </el-slider>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8">
          <el-table :data="weightScheme">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item
                    v-for="(item, index) in props.row.scheme"
                    :key="index"
                    :label="item.point"
                  >
                    <span>{{ item.weight }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="方案名称" prop="name"> </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  >应用</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog
        width="30%"
        title="保存为新方案"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-form :model="initialName">
          <el-form-item label="方案名" :label-width="formLabelWidth">
            <el-input v-model="initialName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="appendToScheme()">确定</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="newScheme">保存为新方案</el-button>
        <el-button @click="weightBoxVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="2019年全国省级医保改革指数（不含港澳台）"
      :visible.sync="chartDialogVisible"
      width="100rem"
      height="80rem"
    >
      <ChartView></ChartView>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="generatorImage">导出报表</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FinalScore from "./components/FinalScore";
import Dump from "./assets/data/schema.json";
// import Score from "./assets/data/score.json";
import ChartView from "./components/Chart";
//   cchange
import TotalData from "./assets/data/totalData.json";
// import Data from './assets/data/data.csv';
// import * as d3 from 'd3'
// import Papa from 'papaparse';
import * as LineUpJS from "lineupjs";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import html2canvas from "html2canvas";

export default {
  name: "App",
  components: {
    FinalScore,
    ChartView,
  },
  data() {
    return {
      cats: ["c1", "c2", "c3"],
      // data: [],
      res: [],
      lineup: {},
      selectedIdx: [],
      curInfo: {},
      curRowIdx: 0,
      curDataWeight: [],
      curProvince: "",
      dialogTableVisible: false,
      chartDialogVisible: false,
      weightBoxVisible: false,
      innerVisible: false,
      customColor: "#409eff",
      percentage: 0,
      temp: [],
      initialWeight: [],
      initialName: "",
      weightScheme: [],
      formLabelWidth: "120px",
      // {跟进时间: 0.6, 跟进政策: 0.6, 年完成度: 1, 政策覆盖: 1, 创新点: 1
      scheme: {},
      columnName: [],
      initialData: [],
    };
  },
  computed: {
    selectedArr: {
      get: function () {
        return this.selectChanged;
      },
      set: function (v) {
        console.log(v, this.selectChanged);
        let arr = [1, 2, 3];
        return arr;
      },
    },
  },
  watch: {
    data: function (newData, oldData) {
      console("after Change DAta :", newData, oldData);
    },
  },
  methods: {
    test(item) {
      alert(item);
    },
    parsed() {
      // 这边处理完的data是只有分数字段的

      //   cchange
      // this.data = JSON.parse(JSON.stringify(Score));
      //  this.columnName = Object.keys(this.data[0]);
      this.data = [];
      this.initialData = Object.values(JSON.parse(JSON.stringify(TotalData)));
      this.columnName = Object.keys(this.initialData[0])
        .slice(11, 20)
        .concat(["文号", "文件名称", "政策分布"]);
      // this.columnName.unshift(this.columnName.pop());

      console.log("column", this.columnName);
      this.initialData.map((el) => {
        let obj = {};
        this.columnName.forEach((key) => {
          obj[key] = el[key];
        });
        this.data.push(obj);
      });

      // console.log("this.data", this.data);
    },
    getSorted() {
      // let result = new Map()
      let result = [];
      this.data.forEach((el, index) => {
        let temp = {
          province: el["省份"],
          indexation: el["得分"],
        };
        if (index == 0) {
          result.push(temp);
        } else {
          if (
            result.find((target) => target.province === el["省份"]) != undefined
          ) {
            result[
              result.findIndex((i) => i.province === el["省份"])
            ].indexation += el["得分"];
          } else {
            result.push(temp);
          }
        }
      });
      result.forEach((el) => (el.indexation = parseInt(el.indexation)));
      // console.log('current result ',result)

      result.sort((a, b) => {
        return b.indexation - a.indexation;
      });
      // this.res = result.slice(0, 10);
      this.res = result
      //   console.log("result : current ", this.res);
    },
    // viewAble(lineup) {
    //   const node = lineup.node;
    //   console.log("node :", node);
    //   Object.defineProperties(node, {
    //     lineup: {
    //       value: "lineup",
    //     },
    //     value: {
    //       get: () =>
    //         lineup.getSelection().map((index) => lineup.data.data[index]),
    //       set: (value) => {
    //         const data = lineup.data.data;
    //         lineup.setSelection(value ? value.map((v) => data.indexOf(v)) : []);
    //       },
    //     },
    //   });
    //   lineup.on("selectionChanged", () =>
    //     // node.dispatchEvent(new CustomEvent('input'))
    //     console.log("selection changed:")
    //   );
    //   // after proper layouting
    //   function check() {
    //     const height = node.querySelector(
    //       LineUpJS.version.startsWith("3")
    //         ? ".lineup-multi-engine > main"
    //         : ".le-body"
    //     ).clientHeight;
    //     if (height > 100) {
    //       lineup.update();
    //     } else {
    //       setTimeout(check, 100);
    //     }
    //   }
    //   setTimeout(check, 100);
    //   return node;
    // },
    increase(scope) {
      let idx = scope.$index;
      this.curDataWeight[idx].weight += 20;
      if (this.curDataWeight[idx].weight > 0) {
        this.curDataWeight[idx].weight = 100;
      }
      this.curDataWeight[idx].finalScore =
        (this.curDataWeight[idx].score * this.curDataWeight[idx].weight) / 100;
      console.log("increase and now:", this.curDataWeight);
    },
    decrease(scope) {
      let idx = scope.$index;

      this.curDataWeight[idx].weight -= 20;
      if (this.curDataWeight[idx].weight < 0) {
        this.curDataWeight[idx].weight = 0;
      }
      this.curDataWeight[idx].finalScore =
        (this.curDataWeight[idx].score * this.curDataWeight[idx].weight) / 100;
      console.log("decrease and now:", this.curDataWeight);
    },
    update() {
      // this.curDataWeight
      this.dialogTableVisible = false;
      // 计算改变后的得分
      let totalCurScore = this.curDataWeight.reduce(
        (sum, el) => sum + el.finalScore,
        0
      );
      // totalCurScore
      console.log("afer changed:", totalCurScore);
    },
    cancel() {
      // this.curDataWeight = this.temp
      this.dialogTableVisible = false;
    },
    exportExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#total-score"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], {
            type: "application/octet-stream",
          }),
          "改革指数.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    /**
     * 将页面指定节点内容转为图片
     * 1.拿到想要转换为图片的内容节点DOM；
     * 2.转换，拿到转换后的canvas
     * 3.转换为图片
     */
    generatorImage() {
      //   html2canvas(document.getElementById("score").childNodes[1]).then(
      html2canvas(document.getElementById("chart-view")).then((canvas) => {
        // this.$refs.addImage.append(canvas);
        //  通过a标签下载到本地
        let link = document.createElement("a");
        link.href = canvas.toDataURL();
        link.setAttribute("download", "改革指数.png");
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
      });
    },

    // 保存整体权重方案，应用到全局
    // 1. 已保存的配置存到localStorage

    // 编辑权重
    edit() {
      this.weightBoxVisible = true;
      this.initialWeight = [];
      let datum = this.data[0];
      let point = Object.keys(datum);
      for (let i = 2; i < 8; i++) {
        let initWeight = {
          point: point[i],
          weight: 100,
        };
        this.initialWeight.push(initWeight);
        // console.log('this.initialWeight', this.initialWeight)
      }
    },
    newScheme() {
      this.innerVisible = true;
      this.initialName = "";
    },
    appendToScheme() {
      let item = {
        scheme: this.initialWeight,
        name: this.initialName,
      };
      this.weightScheme.push(item);
      // todolist：
      // 还需要判重，如果weightScheme中已经存在name为当前initialName的item的话，就弹出msgBox是否需要覆盖掉原来的选项
      console.log("weightScheme:", this.weightScheme);
      // console.log('currentRl:', el)
      this.innerVisible = false;
    },
    handleEdit(index, row) {
      console.log(index, row);
      // todolist
      // 根据row里面的权重，对lineup视图进行一个全局的刷新，update方法？
      this.$confirm("是否将当前权重方案适配到所有省份?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          row.scheme.forEach((el) => {
            this.scheme[el.point] = el.weight / 100;
          });
          console.log("this scheme ；", this.scheme);
          this.changeData();
          this.getSorted();
          this.$message({
            type: "success",
            message: "适配于当前权重的改革指数已更新",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    handleDelete(index, row) {
      // 调通
      console.log(index, row);
      this.weightScheme.splice(index, 1);
      console.log("this.weightScheme", this.weightScheme);
    },
    init() {
      let contain = document.getElementById("score");
      console.log("contain:", contain);
      console.log("Dump:", Dump);
      console.log("test data:", this.data);
      this.lineup = LineUpJS.builder(this.data)
        .deriveColumns(this.columnName)
        .deriveColors()
        .restore(Dump)
        .buildTaggle(contain);

      let arr = Dump.rankings[0].columns;
      console.log("arr: thing ", arr);
    },

    // 改变data的数据，如果scheme改变之后，就在watch中调用
    changeData() {
      this.data.forEach((el) => {
        let sum = 0;
        for (let key in el) {
          for (let item in this.scheme) {
            if (key == item) {
              // console.log(key, el[key], this.scheme[item])
              sum += el[key] * this.scheme[item];
              break;
            }
          }
        }
        console.log("得分改变：", el["得分"], sum);
        // 吧整体方案再乘以类型分的权重
        el["得分"] = sum * el["类型分"];
        // console.log('leixnigfen:',el['类型分'])
      });
      // console.log('after cha1111', this.data)
      // 更新视图
      this.lineup.update();
    },

    sideBarDOM() {
      // 缩略视图
      let changeScaleView = document.getElementsByClassName(
        "lu-rule-button-chooser"
      )[0];

      changeScaleView.firstChild.children[1].innerText = "缩略视图";
      // let filterArr = document.getElementsByClassName('lu-filter-missing lu-disabled')
      // filterArr.forEach(el=>el.innerText='')
      document
        .getElementsByClassName("lu-side-panel-entry")[0]
        .setAttribute("id", "provinceView");
      // 表格导入到视图中去
      let beApended = document.getElementById("provinceView");
      let children = document.getElementById("total-score");
      beApended.appendChild(children);

      let mainSidePanel = document.getElementsByClassName("lu-side-panel")[0];

      var newItem = document.createElement("div");
      newItem.setAttribute("class", "mSideBar b-shadow");
      var textnode = document.createTextNode("交互栏");
      newItem.appendChild(textnode);

      mainSidePanel.insertBefore(newItem, changeScaleView);
    },

    // 点击单行数据触发的事件
    onclickChange() {
      this.lineup.on("selectionChanged", (dataIdx) => {
        this.curRowIdx = dataIdx;
        //  curInfo 是对象的情况下
        this.curInfo = this.data[dataIdx];
        this.curProvince = this.curInfo["省份"];

        // 在这边修改 增删改内容
        this.dialogTableVisible = true;
      });
    },

    // 编辑单项政策分的操作
    editRowData() {
      // 拿到curinfo为对象的情况下
      const scores = Object.keys(this.curInfo).slice(0,6) //["跟进时间", "跟进政策类型", "年完成度", "政策覆盖面", "创新点", "部门协同"]
      let fileName = this.curInfo['文件名称']
      // 计算改变后的得分，重新写入data中
      let scoreChanged = 0
      for(let item in scores){
        let num = this.curInfo[scores[item]]
        num = (typeof(num) == 'number') ? num : parseFloat(num)
        scoreChanged += num
        this.curInfo[scores[item]] = num
      }
      this.curInfo['得分'] = scoreChanged * this.curInfo['类型分']
      this.data[this.curRowIdx] = this.curInfo
      // console.log('changede defen',this.data[this.curRowIdx])
      
      this.$message({
        message: `关于<<${fileName}>>文件内容已更新`,
        type: "success",
      });
      this.lineup.update();
      this.dialogTableVisible = false;
    },
    cancelEditRowData() {
      this.dialogTableVisible = false;
    },
  },

  created() {
    // this.init()
  },

  mounted() {
    this.parsed();
    this.init();
    this.onclickChange();
    this.sideBarDOM();
    this.getSorted();
    // let parent = document.getElementsByClassName('le-thead')[0]
    let child = document.getElementsByClassName("le-thead")[0].childNodes[1];
    child.parentNode.removeChild(child);
  },
};
</script>

<style lang="scss" scoped>
.el-header,
.el-footer {
  // background-color: #b3c0d1;
  color: #ffffff;
  text-align: center;
}

.el-container {
  height: 100vh;
}

.el-header {
  height: 5vh;
  // margin: 0 auto;
  // display: f;
}

.el-aside {
  width: 200px !important;
  /* background-color: #d3dce6; */
  color: #333;
  line-height: 200px;
}

.el-main {
  // height: 93vh;
  background-color: white;
  color: #333;
  line-height: normal;
}

.el-col {
  height: 100%;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
