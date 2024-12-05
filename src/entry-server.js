import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { Helmet } from 'react-helmet-async';

export function render(url) {
  const helmetContext = {};

  // Create a StaticRouter for SSR rendering
  const content = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );

  // Extract the head elements (meta tags, etc.) using react-helmet-async
  const head = Helmet.renderStatic();

  // Return the head and content to be injected into the template
  return {
    head: head.title.toString() + head.meta.toString(),
    html: content,
  };
}
