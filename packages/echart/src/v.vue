<script setup lang="ts">
import { onMounted, ref, reactive, toRaw } from "vue";
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
import type { ComposeOption, EChartsType } from "echarts/core";
// 引入柱状图图表，图表后缀都为 Chart
import { CustomChart, CustomSeriesOption } from "echarts/charts";
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
  DataZoomComponent,
  DataZoomComponentOption,
} from "echarts/components";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  CustomChart,
  CanvasRenderer,
]);

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type EChartsOption = ComposeOption<
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | DataZoomComponentOption
  | CustomSeriesOption
>;

const domRef = ref();
// 已经被选中的所有点
const dateIndex = ref<number[]>([]);
const startPointInfo = ref<[number, number, number]>();
const isAdd = ref<boolean>(true);
const myChart = reactive<{ instance: EChartsType | null }>({
  instance: null,
});

const room = ["100", "101", "102", "103", "104", "105"];
const day = [
  "2024-01-01",
  "2024-01-02",
  "2024-01-03",
  "2024-01-04",
  "2024-01-05",
  "2024-01-06",
  "2024-01-07",
  "2024-01-08",
  "2024-01-09",
  "2024-01-10",
  "2024-01-11",
  "2024-01-12",
  "2024-01-13",
  "2024-01-14",
];
const roomLength = room.length;
const dayLength = day.length;
let data: any[] = [];
const width = 100;
const height = 50;
const gripWidth = width * dayLength;
const gripHeight = height * roomLength;

const tooltipConfig = (x: number, y: number) => ({
  position: [x * width, y * height],
  padding: [0, 0, 0, 4],
  textStyle: {
    color: "#888",
    fontSize: 12,
  },
  formatter: function (params: { value: any[] }) {
    return /*html*/ `
                <div>${params.value[4]}</div>
                <div>${params.value[2]}</div>
                <div>${params.value[5]}</div>
           `;
  },
  borderColor: "#b3c8ff",
  extraCssText:
    "width:100px;height:50px;box-sizing:border-box;border-radius:0px;line-height:16px;",
});

for (let y = 0; y < roomLength; y++) {
  // 6个房型
  for (let x = 0; x < dayLength; x++) {
    // 宽100， 高50
    const arr = [
      x * width,
      y * height,
      room[y],
      day[x],
      "超级大床房",
      `￥${Math.floor(Math.random() * 1000)}`,
    ];

    data.push({
      value: arr,
      // tooltip: tooltipConfig(x, y),
    });
  }
}

const customRenderItem = (params: any, api: any) => {
  const start = api.coord([api.value(0), api.value(1)]);
  const size = api.size!([width, height]) as number[];

  const rect: any = {
    type: "rect",
    shape: {
      x: 0,
      y: 0,
      width: size[0],
      height: size[1],
    },
    style: {
      fill: "#fff",
      stroke: "#ccc",
      lineWidth: 1,
    },
    emphasis: {
      focus: "series",
      style: {
        fill: "#eee",
      },
    },
    // transition: [],
    // textConfig: {
    //   position: "insideLeft",
    // },
    // textContent: {
    //   type: "text",
    //   style: {
    //     text: `${api.value(4)}\n${api.value(2)}\n${api.value(5)}`,
    //     fill: "#999",
    //   },
    // },
  };

  const path: any = {
    type: "path",
    shape: {
      pathData: `M0,0 L0,10 L20,10 L20,8 L2,8 L2,0 L0,0`,
      x: 40,
      y: 20,
      width: 20,
      height: 10,
    },
    originX: 45,
    originY: 20,
    rotation: Math.PI / 4,
    style: {
      fill: "#fff",
      lineWidth: 1,
    },
  };

  const text = {
    type: "text",
    id: params.dataIndex,
    // z2: 100,
    // x: 0,
    // y: 0,
    style: {
      text: "",
      fill: "#999",
    },
    inside: true,
    opacity: 0,
  };

  // if (currentIndex && params.dataIndex === currentIndex) {
  //   text.style.text = `${api.value(4)}\n${api.value(2)}\n${api.value(5)}`;
  // } else {
  //   text.style.text = "";
  // }

  // const group = new echarts.graphic.Group();

  const group = {
    type: "group",
    children: [],
    x: start[0],
    y: start[1],
    width: size[0],
    height: size[1],
  };

  if (dateIndex.value.includes(params.dataIndex)) {
    rect.emphasis = {
      style: {
        fill: "#b3c8ff",
      },
    };
    // rect.textContent = {
    //   style: {
    //     style: {
    //       text: "",
    //     },
    //   },
    // };
  } else {
    path.style = {
      opacity: 0,
    };
  }

  (group.children as any[]) = [rect, path, text];

  // text.on('mouseover', function () {
  //               text.setStyle({
  //                   invisible: false // 鼠标移入时显示文本
  //               });
  //           });

  return group;
};

const globalOut = () => {
  mouseUp();
};

const mouseDown = (params: any) => {
  // myChart.instance?.off("mouseover", mouseoverFull);
  myChart.instance?.on("mouseover", mouseOver);
  myChart.instance?.on("globalout", globalOut);
  // myChart.instance?.setOption({
  //   tooltip: {
  //     show: false,
  //   },
  // });

  const currentIndex = params.dataIndex;
  const [x, y] = params.value;
  startPointInfo.value = [x, y, currentIndex];
  //   判断上一个点击的节点是否已经选中，
  isAdd.value = !dateIndex.value.includes(currentIndex);
};

const mouseClick = (params: any) => {
  const currentIndex = params.dataIndex;
  const findIndex = dateIndex.value.indexOf(currentIndex);
  if (findIndex !== -1) {
    // 如果当前点击的节点存在则取消操作
    removeIndex(findIndex, currentIndex);
  } else {
    // 如果当前点击的节点不存在则新增操作
    addIndex(currentIndex);
  }
  myChart.instance?.setOption({
    // tooltip: {
    //   show: true,
    // },
    series: {
      renderItem: (params: any, api: any) =>
        customRenderItem(params, api) as any,
    },
  });
};

const mouseoverFull = (params: any) => {
  console.log(myChart.instance?.getOption());

  // var graphicElement = myChart.instance?.getModel().getComponent('series').eachItemGraphicEl(function (el) {
  //       return el.customId === params.dataIndex;
  //   });
  //   console.log(graphicElement);
  //   if (graphicElement) {
  //       // 切换图形元素的显示状态
  //       graphicElement.setVisible(!graphicElement.isVisible());
  //   }

  // var zr = myChart.instance?.getZr();
  // console.log(zr);

  // 获取当前hover的数据项对应的图形元素
  // var component = params.componentType;
  // var seriesIndex = params.seriesIndex;
  // var dataIndex = params.dataIndex;

  // if (component === "series" && params.seriesType === "custom") {
  //   // 通过dataIndex和seriesIndex获取对应的图形元素组
  //   var group = myChart.instance?.
  //     .getModel()
  //     .getSeriesByIndex(seriesIndex)
  //     .getData()
  //     .getItemGraphicElByIndex(dataIndex);

  //   // 获取图形元素组中的文本标签
  //   var text = group.childOfName("text");

  //   // 更新文本标签的内容并显示它
  //   text.attr({
  //     style: {
  //       text: "数据值: " + params.data.value[0], // 假设数据是一个数组，第一个元素是值
  //       visible: true, // 显示文本标签
  //     },
  //   });
  // }

  // const currentIndex = params.dataIndex;
  // const findIndex = dateIndex.value.indexOf(currentIndex);
  // // console.log(22222222, findIndex);
  // if (findIndex !== -1) {
  //   // 如果当前点击的节点存在则取消操作
  //   myChart.instance?.setOption({
  //     tooltip: {
  //       show: false,
  //     },
  //   });
  // } else {
  //   // 如果当前点击的节点不存在则新增操作
  //   myChart.instance?.setOption({
  //     tooltip: {
  //       show: true,
  //     },
  //   });
  // }
};

const mouseUp = () => {
  myChart.instance?.off("mouseover", mouseOver);
  myChart.instance?.off("globalout", globalOut);
  // 非选择时设置tooltip
  // myChart.instance?.on("mouseover", mouseoverFull);

  myChart.instance?.setOption({
    // tooltip: {
    //   show: true,
    // },
    series: {
      renderItem: (prams: any, api: any) => customRenderItem(prams, api) as any,
    },
  });
};

const mouseOver = (params: any) => {
  //   缓存上一个节点数据
  const startInfo = startPointInfo.value as number[];
  const [x, y] = params.value;

  //   与开始节点的关系
  const startIndex = startInfo[2];
  const lengthX = (x - startInfo[0]) / width;
  const lengthY = (y - startInfo[1]) / height;

  let selectPoint = [];
  // 考虑方向
  for (let y = 0; y <= Math.abs(lengthY); y++) {
    // lengthY大于0向下，小于0向上
    const directionY = lengthY > 0 ? 1 : -1;
    const beginX = startIndex + dayLength * y * directionY;
    for (let x = 0; x <= Math.abs(lengthX); x++) {
      // lengthX大于0向右，小于0向左
      const directionX = lengthX > 0 ? 1 : -1;
      selectPoint.push(beginX + x * directionX);
    }
  }

  selectPoint.forEach((item) => {
    toggle(item);
  });
};

const removeIndex = (findIndex: number, index: number) => {
  dateIndex.value.splice(findIndex, 1);
  (toRaw(myChart).instance as EChartsType).dispatchAction({
    type: "downplay",
    dataIndex: index,
  });
};

const addIndex = (index: number) => {
  dateIndex.value.push(index);
  (toRaw(myChart).instance as EChartsType).dispatchAction({
    type: "highlight",
    dataIndex: index,
  });
};

const toggle = (index: number) => {
  // 批量操作
  const findIndex = dateIndex.value.indexOf(index);

  if (!isAdd.value && findIndex !== -1) {
    // 如果当前点击的节点存在则取消操作
    removeIndex(findIndex, index);
  }
  if (isAdd.value && findIndex === -1) {
    // 如果当前点击的节点不存在则新增操作
    addIndex(index);
  }
};

onMounted(() => {
  if (domRef.value) {
    const option: EChartsOption = {
      tooltip: {
        trigger: "item",
        show: false,
        showDelay: 0,
        hideDelay: 0,
        transitionDuration: 0,
      },
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: gripWidth,
        height: gripHeight,
      },
      xAxis: {
        position: "top",
        min: 0,
        max: gripWidth,
        show: false,
      },
      yAxis: {
        inverse: true,
        min: 0,
        max: gripHeight,
        show: false,
      },
      series: {
        type: "custom",
        encode: {
          tooltip: [4, 5],
          itemName: 4,
        },
        renderItem: (prams, api) => customRenderItem(prams, api) as any,
        // labelLine: {
        //   show: true,
        //   showAbove: true,
        // },
        data: data,
        // animation: false,
      },
    };
    const chartInstance = echarts.init(domRef.value);
    myChart.instance = chartInstance;
    chartInstance.setOption(option);

    // 移动批量切换
    chartInstance.on("mousedown", mouseDown);
    // 点击切换颜色
    chartInstance.on("click", mouseClick);
    // 设置选中颜色
    chartInstance.on("mouseup", mouseUp);
    // 非选择时设置tooltip
    // chartInstance.on("mousemove", mouseoverFull);
  }
});
</script>

<template>
  <div class="calendar-wrap">
    <div ref="domRef" id="chart-container"></div>
  </div>
</template>

<style scoped lang="less">
.calendar-wrap {
  width: 1200px;
  height: 400px;
  border: 1px solid red;
  overflow: scroll;
}
#chart-container {
  height: 300px;
  width: 1400px;
}
</style>
