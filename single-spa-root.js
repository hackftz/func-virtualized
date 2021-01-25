import React from 'react';
import ReactDOM from 'react-dom';
import rootComponent from './src/App';
// 注意 Singlespacontext 是一个为react@16.3(如果可用的话)提供的上下文，包含了 singleSpa props
import singleSpaReact, { SingleSpaContext } from 'single-spa-react';

function domElementGetter() {
  return document.getElementById('singleApp');
}

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent,
  domElementGetter,
  // errorBoundary(err, info, props) {
  //   return <div>This renders when a catastrophic error occurs</div>;
  // },
});

export const bootstrap = reactLifecycles.bootstrap;
export const mount = reactLifecycles.mount;
export const unmount = reactLifecycles.unmount;
