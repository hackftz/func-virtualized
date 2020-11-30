import './App.css'

import React, { Component } from 'react'
import Item from './Item'

const height = 60
const bufferSize = 5

export default class VirtualizedList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      startOffset: 0,
      endOffset: 0,
      visibleData: []
    }

    this.data = new Array(1000).fill(true)

    this.startIndex = 0
    this.endIndex = 0
    this.scrollTop = 0

    this.doc = null

    // 缓存已渲染元素的位置信息
    this.cache = []
    // 缓存锚点元素的位置信息
    this.anchorItem = {
      index: 0, // 锚点元素的索引值
      top: 0, // 锚点元素的顶部距离第一个元素的顶部的偏移量(即 startOffset)
      bottom: 0 // 锚点元素的底部距离第一个元素的顶部的偏移量
    }

    this.handleScroll = this.handleScroll.bind(this)
    this.cachePosition = this.cachePosition.bind(this)
  }
  
  cachePosition (node, index) {
    // 每个item 挂载好后执行
    const rect = node.getBoundingClientRect()
    const top = rect.top + window.pageYOffset // 防止有其他滚动干扰 重新取值 || 0
    const bottom = top + height

    // 判断 缓存项已有的话则不存入
    let flag = false

    for (let i = 0; i < this.cache.length; i++) {
      const { index: oldIndex, top: oldTop, bottom: oldBottom } = this.cache[i];
      if (index === oldIndex && top === oldTop && bottom === oldBottom) {
        flag = true
      }
    }
    
    if (!flag) {
      this.cache.push({
        index,
        top,
        bottom
      })
    }
  }

  // 滚动事件处理函数
  handleScroll (e) {
    if (!this.doc) {
      // 兼容 iOS Safari/Webview
      this.doc = window.document.body.scrollTop ? window.document.body : window.document.documentElement
    }

    const scrollTop = this.doc.scrollTop

    // 判断滚动值的正负变化判断是向上滚动还是向下滚动 首次滚动会更新锚点对象
    if (scrollTop > this.scrollTop) {
      if (scrollTop > this.anchorItem.bottom) {
        this.updateBoundaryIndex(scrollTop)
        this.updateVisibleData()
      }
    } else if (scrollTop < this.scrollTop) {
      if (scrollTop < this.anchorItem.top) {
        this.updateBoundaryIndex(scrollTop)
        this.updateVisibleData()
      }
    }

    this.scrollTop = scrollTop
  }

  // 更新startIndex和endIndex
  updateBoundaryIndex (scrollTop) {
    scrollTop = scrollTop || 0
    // 用户正常滚动下，根据 scrollTop 找到新的锚点元素位置
    const anchorItem = this.cache.find(item => item.bottom >= scrollTop)

    if (!anchorItem) {
      // 滚的太快，找不到锚点元素，这个暂不处理
      return
    }

    this.anchorItem = {
      ...anchorItem
    }

    this.startIndex = this.anchorItem.index
    this.endIndex = this.startIndex + this.visibleCount
  }

  // 根据startIndex和endIndex 计算真实列表数据
  updateVisibleData () {
    const visibleData = this.data.slice(this.startIndex, this.endIndex)

    this.setState({
      startOffset: this.anchorItem.top,
      endOffset: (this.data.length - this.endIndex) * height,
      visibleData
    })
  }

  componentDidMount () {
    // 首次渲染
    this.visibleCount = Math.ceil(window.innerHeight / height) + bufferSize
    this.endIndex = this.startIndex + this.visibleCount
    this.updateVisibleData()

    // 添加滚动监听event
    window.addEventListener('scroll', this.handleScroll, false)
  }

  render () {
    const { startOffset, endOffset, visibleData } = this.state

    return (
      <div className='wrapper' ref={node => { this.wrapper = node }}>
        <div style={{ paddingTop: `${startOffset}px`, paddingBottom: `${endOffset}px` }}>
          {
            visibleData.map((item, index) => {
              return (
                <Item
                  cachePosition={this.cachePosition}
                  key={this.startIndex + index}
                  index={this.startIndex + index}
                />
              )
            })
          }
        </div>
      </div>
    )
  }
}