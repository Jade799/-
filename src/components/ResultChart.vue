<template>
  <div class="chart-wrapper">
    <v-chart :option="chartOption" autoresize class="chart" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent, TooltipComponent, LegendComponent, GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { algorithmColors, algorithmLabels } from '../mock/polls.js'

use([BarChart, PieChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer])

const props = defineProps({
  poll: { type: Object, required: true }
})

const chartOption = computed(() => {
  const poll = props.poll
  const color = algorithmColors[poll.algorithm] || '#409eff'
  const labels = poll.options.map(o => o.label)
  const values = poll.options.map(o => o.count)

  if (poll.algorithm === 'scoring') {
    // 打分制：柱状图展示平均分（满分10分）
    return {
      tooltip: { trigger: 'axis', formatter: (params) => {
        const p = params[0]
        return `${p.name}<br/>平均分：${p.value} 分`
      }},
      grid: { left: 60, right: 30, top: 20, bottom: 50 },
      xAxis: { type: 'category', data: labels, axisLabel: { rotate: 20, fontSize: 11 } },
      yAxis: { type: 'value', min: 0, max: 10, name: '平均分' },
      series: [{
        type: 'bar',
        data: values,
        itemStyle: {
          color: new (window.echarts?.graphic?.LinearGradient || (() => color))(0, 0, 0, 1, [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#79bbff' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '50%',
        label: { show: true, position: 'top', formatter: (p) => p.value + ' 分' }
      }]
    }
  }

  if (poll.algorithm === 'borda') {
    // Borda 排序：展示平均排名分数
    return {
      tooltip: { trigger: 'axis', formatter: (params) => {
        const p = params[0]
        return `${p.name}<br/>平均排名分：${p.value}`
      }},
      grid: { left: 60, right: 30, top: 20, bottom: 50 },
      xAxis: { type: 'category', data: labels, axisLabel: { rotate: 20, fontSize: 11 } },
      yAxis: { type: 'value', name: 'Borda 分数' },
      series: [{
        type: 'bar',
        data: values.map(v => +v.toFixed(2)),
        itemStyle: {
          color: new (window.echarts?.graphic?.LinearGradient || (() => color))(0, 0, 0, 1, [
            { offset: 0, color: '#f56c6c' },
            { offset: 1, color: '#f89898' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '50%',
        label: { show: true, position: 'top', formatter: (p) => p.value }
      }]
    }
  }

  if (poll.algorithm === 'weighted') {
    // 权重分配：展示平均权重百分比
    const total = values.reduce((a, b) => a + b, 0) || 1
    return {
      tooltip: { trigger: 'axis', formatter: (params) => {
        const p = params[0]
        return `${p.name}<br/>平均权重：${p.value}%`
      }},
      grid: { left: 60, right: 30, top: 20, bottom: 50 },
      xAxis: { type: 'category', data: labels, axisLabel: { rotate: 20, fontSize: 11 } },
      yAxis: { type: 'value', max: 100, name: '权重 (%)' },
      series: [{
        type: 'bar',
        data: values.map(v => +((v / total) * 100).toFixed(1)),
        itemStyle: {
          color: new (window.echarts?.graphic?.LinearGradient || (() => color))(0, 0, 0, 1, [
            { offset: 0, color: '#e6a23c' },
            { offset: 1, color: '#f0c78a' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '50%',
        label: { show: true, position: 'top', formatter: (p) => p.value + '%' }
      }]
    }
  }

  // 单选/多选：柱状图
  const maxVal = Math.max(...values, 1)
  return {
    tooltip: { trigger: 'axis', formatter: (params) => {
      const p = params[0]
      return `${p.name}<br/>票数：${p.value} 票 (${(p.value / poll.totalVotes * 100).toFixed(1)}%)`
    }},
    grid: { left: 60, right: 30, top: 20, bottom: 50 },
    xAxis: { type: 'category', data: labels, axisLabel: { rotate: 20, fontSize: 11 } },
    yAxis: { type: 'value', name: '票数' },
    series: [{
      type: 'bar',
      data: values,
      itemStyle: {
        color: new (window.echarts?.graphic?.LinearGradient || (() => color))(0, 0, 0, 1, [
          { offset: 0, color: color },
          { offset: 1, color: color + '88' }
        ]),
        borderRadius: [4, 4, 0, 0]
      },
      barWidth: '50%',
      label: { show: true, position: 'top', formatter: (p) => p.value + ' 票' }
    }]
  }
})
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 380px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
