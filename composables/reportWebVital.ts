import { useRuntimeConfig, useNuxtApp } from '#app'
import { useErrorReporter } from '~/composables/errorReporter'
import { onINP, onLCP, onCLS } from 'web-vitals/attribution'
import type { Metric } from 'web-vitals/attribution'
import { config } from '~/config/config'

interface MetricWithAttribution extends Metric {
  attribution?: any;
}

export const useWebVitals = () => {
  const { reportError } = useErrorReporter()
  const { isClient } = useNuxtApp()
  const host = config.host
  
  const reportWebVital = async (metric: MetricWithAttribution) => {
    try {
      const uri = `${host}/lapi/webvitals`
      //reportError('Test Log, reportWebVital vital:', metric.name, metric.value)
      let pageUrl = ''
      if (typeof window !== 'undefined') {
        pageUrl = window.location.href
      }

      const formData = new FormData()
      
      // 添加度量数据到FormData
      formData.append('metric_id', metric.id)
      formData.append('metric_name', metric.name)
      formData.append('metric_value', metric.value.toString())
      formData.append('metric_delta', metric.delta.toString())
      formData.append('metric_rating', metric.rating)
      formData.append('metric_navigation', metric.navigationType || '')
      formData.append('page_url', pageUrl + "|" + navigator.userAgent)
      if (metric.attribution) {
        formData.append('attribution', JSON.stringify(metric.attribution));
      }
      await $fetch(uri, {
        method: 'POST',
        body: formData
      })
    } catch (err) {
      reportError(err, {
        component: 'WebVitals',
        action: 'reportWebVital',
        metricName: metric?.name,
        metricValue: metric?.value
      })
    }
  }

  // 修改 INP 上报方法
  const startINPReporting = () => {
    const attributionOptions = { 
      attribution: true 
    } as any;
    onINP(reportWebVital, attributionOptions);
  }

  // 添加 LCP 上报方法
  const startLCPReporting = () => {
    // 启用归因收集的配置对象
    const attributionOptions = {
      reportAllChanges: false,
      durationThreshold: 0,  // 捕获所有事件，不设置阈值
      attribution: true,     // 关键: 启用归因收集
    } as any;
    
    onLCP((metric) => {
      //console.log('LCP metric with attribution:', metric);
      reportWebVital(metric as MetricWithAttribution);
    }, attributionOptions);  // 传入增强配置
  }

  // 添加 CLS 上报方法
  const startCLSReporting = () => {
    // 启用归因收集的配置对象
    const attributionOptions = {
      reportAllChanges: false,
      attribution: true,     // 关键: 启用归因收集
    } as any;
    
    onCLS((metric) => {
      //console.log('CLS metric with attribution:', metric);
      reportWebVital(metric as MetricWithAttribution);
    }, attributionOptions);  // 传入增强配置
  }

  return {
    reportWebVital,
    startINPReporting,
    startLCPReporting,
    startCLSReporting
  }
}

// 使用方法
// const { reportWebVital, startINPReporting, startLCPReporting } = useWebVitals()
// startINPReporting()
// startLCPReporting()
// startCLSReporting()