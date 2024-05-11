<script setup lang="ts">
// 手写滚动条，控制其他元素滚动
import { onMounted, ref } from "vue";

const scrollWrapRef = ref();
const scrollSPRef = ref();
const headWrapRef = ref();
const headRef = ref();

const width = ref(0);
const left = ref(0);

onMounted(() => {
  const thumbWidth = Math.floor(
    (headWrapRef.value.offsetWidth * headWrapRef.value.offsetWidth) /
      headRef.value.scrollWidth
  );

  width.value = thumbWidth < 50 ? 50 : thumbWidth;

  scrollSPRef.value.addEventListener("mousedown", (event: any) => {
    event.preventDefault();
    const startX = event.pageX;
    const startLeft = scrollSPRef.value.offsetLeft;
    console.log(startX, startLeft);
    const drag = (mEvent: any) => {
      const deltaX = mEvent.pageX - startX;

      const newLeft = Math.max(
        0,
        Math.min(
          headWrapRef.value.offsetWidth - scrollSPRef.value.clientWidth,
          startLeft + deltaX
        )
      );

      const scrollX =
        (newLeft /
          (headWrapRef.value.offsetWidth - scrollSPRef.value.clientWidth)) *
        (headRef.value.scrollWidth - headWrapRef.value.offsetWidth);
      headWrapRef.value.scrollLeft = scrollX;
      left.value = newLeft;
      // console.log(newLeft, scrollX);
    };

    const endDrag = () => {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", endDrag);
    };

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", endDrag);
    // scrollSPRef.value.addEventListener("mouseout", endDrag);
  });
});
</script>

<template>
  <div class="wrap">
    <div class="head-wrap" ref="headWrapRef">
      <div class="head" ref="headRef">
        <div v-for="item in 330" class="item">{{ item }}</div>
      </div>
    </div>
    <div class="scroll" ref="scrollWrapRef">
      <div
        class="sp-scroll"
        ref="scrollSPRef"
        :style="{ width: `${width}px`, left: `${left}px` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  width: 100%;
  height: 600px;
  border: 1px solid red;
  overflow: hidden;
}
.head-wrap {
  height: 50px;
  width: 100%;
  background: #eee;
  overflow: hidden;
}
.head {
  /* width: 3300px; */
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
}

.item {
  flex: 0 0 100px;
  height: 50px;
}
.scroll {
  position: relative;
  height: calc(100% - 50px);
}
.sp-scroll {
  position: absolute;
  left: 0;
  bottom: 0;
  background-color: #999;
  height: 8px;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
}
.cz-scroll {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #999;
  width: 8px;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
}
</style>
