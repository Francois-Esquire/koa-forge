'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var PropTypes = _interopDefault(require('prop-types'));
var reactRouterDom = require('react-router-dom');
var stream = _interopDefault(require('stream'));
var server = require('react-dom/server');

var styles = {"article":"article___home","header":"header___home","h1":"h1___home","span":"span___home","img":"img___home","footer":"footer___home","button":"button___home"};

var styles$1 = {"button":"button___button"};

function Button({ className, children, ...props }) {
  return (
    React.createElement( 'button', Object.assign({},
      { type: "button", className: [styles$1.button]
        .concat(className || [])
        .join(' ')
        .trim() }, props),
      children
    )
  );
}

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

Button.defaultProps = {
  className: '',
  children: 'button',
};

function Home() {
  return (
    React.createElement( 'article', { className: styles.article },
      React.createElement( 'header', { className: styles.header },
        React.createElement( 'h1', { className: styles.h1 },
          React.createElement( 'span', { className: styles.span }, "Find Your Obsession"),
          React.createElement( 'br', null ),
          React.createElement( 'span', { className: styles.span }, "Discover Your Passion")
        )
      ),

      React.createElement( 'img', {
        className: styles.img, src: "/assets/simone-hutsch-scrape.jpg", alt: "blue skies" }),

      React.createElement( 'footer', { className: styles.footer },
        React.createElement( Button, { className: styles.button }, "Explore Now")
      )
    )
  );
}

function Application() {
  return (
    React.createElement( 'main', null,
      React.createElement( reactRouterDom.Switch, null,
        React.createElement( reactRouterDom.Route, { component: Home })
      )
    )
  );
}

// eslint-disable-next-line import/no-mutable-exports
let App = reactRouterDom.withRouter(Application);

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const { hot } = require('react-hot-loader');

  App = hot(module)(App);
}

var Application$1 = App;

const debug = process.env.NODE_ENV !== 'production';

async function render(ctx) {
  const app = (
    React.createElement( reactRouterDom.StaticRouter, { location: ctx.path, context: ctx },
      React.createElement( Application$1, null )
    )
  );

  const html = (
    React.createElement( 'html', { lang: "en-US" },
      React.createElement( 'head', null,
        React.createElement( 'meta', { charSet: "utf-8" }),
        React.createElement( 'meta', { httpEquiv: "X-UA-Compatible", content: "IE=edge" }),
        React.createElement( 'meta', { httpEquiv: "Content-Language", content: "en" }),
        React.createElement( 'meta', { name: "viewport", content: "width=device-width, initial-scale=1" }),
        React.createElement( 'title', null, "Discovery" )

        /* css */,
        debug ? null : React.createElement( 'link', { rel: "stylesheet", href: "/css/main.css" })
      ),
      React.createElement( 'body', null,
        React.createElement( 'div', { id: "app" }, app)

        /* js */,
        React.createElement( 'script', { type: "text/javascript", src: "/js/vendors~main.js" }),
        React.createElement( 'script', { type: "text/javascript", src: "/js/main.js" })
      )
    )
  );

  const body = new stream.Transform({
    transform(chunk, encoding, callback) {
      callback(undefined, chunk);
    },
  });

  body.write('<!DOCTYPE html>');

  server.renderToNodeStream(html).pipe(body);

  return body;
}

module.exports = render;
