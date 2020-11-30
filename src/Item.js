import React, { Component } from 'react'

export default class Item extends Component {
  componentDidMount () {
		// dom挂载好之后 将每个item项 的位置信息 缓存起来
		/* eslint-disable-next-line */
    this.props.cachePosition(this.node, this.props.index)
  }

  render () {
    /* eslint-disable-next-line */
    const {index, item} = this.props

    return (
			// 先拿到item ref索引
      <div className='list-item' style={{ height: '59px' }} ref={node => { this.node = node }}>
        <p>#${index} eligendi voluptatem quisquam</p>
        <p>Modi autem fugiat maiores. Doloremque est sed quis qui nobis. Accusamus dolorem aspernatur sed rem.</p>
      </div>
    )
  }
}