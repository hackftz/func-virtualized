import './App.css';

function App() {
  // 列表计算值的初始化
  let index = 0;
  const len = 2000;
  let fullList = [];

  // 虚拟列表
  let list = [];
  let startIndex = 0;
  let endIndex = 14;

  // 长列表数据
  for (let i = 0; i < len; i++) {
    index++;
    fullList.push({
      id: index,
      text: `item${index}`,
    });
  }

  // 根据数据长度渲染出整个高度
  const fullListHeight = len * 30;

  // 处理实际显示的那些item

  /// 处理list item style 可视高度为300 每个item为30 最多显示10个

  /// 虚拟化列表为15个

  const reCalList = (params) => {
    for (let i = startIndex; i < endIndex + 1; i++) {
      // 样式item
      let styleItem = {};
      styleItem.top = i * 30;
      list.push({
        ...fullList[i], // list基础数据
        ...styleItem,
      });
    }
  };

  reCalList();

  const fullListScroll = (e) => {
    console.log(123);
  };

  return (
    <div className='App'>
      <div 
        className='visible-box'
        onScroll={fullListScroll}
      >
        <ul
          className='full-list'
          style={{ height: fullListHeight + 'px' }}
        >
          {list.map((item) => (
            <li
              className='list-item'
              key={item.id}
              style={{ top: item.top + 'px' }}
            >
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
