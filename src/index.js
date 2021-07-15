import { sep } from 'path';
import { getOptions } from 'loader-utils';
import { validate } from 'schema-utils';
import schema from './options.json';

const normalizePath = (_path) => {
  if (_path.includes(sep)) return _path.split(sep).join('/');
  return _path.replace(/\/\//g, '/');
};

export default function Loader() {
  const { resourcePath } = this;
  const options = getOptions(this);

  validate(schema, options, {
    name: 'Client Page Loader',
    baseDataPath: 'options',
  });

  const { app, id, context } = options;

  const appPath = normalizePath(app);
  const componentPath = normalizePath(resourcePath);

  return `
    import React from 'react';
    import ReactDom from 'react-dom';
    import { hot } from 'react-hot-loader/root';

    import App from "${appPath}";
    import Component from "${componentPath}";

    const state = window.${context};
    const mainEl = document.getElementById("${id}");
    const AppComponent = <App Component={hot(Component)} pageProps={state}/>;

    ReactDom.hydrate(AppComponent, mainEl);
  `;
}
