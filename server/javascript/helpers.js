// In case we want to try server-side rendering
const template = () => {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <title>Blog - Home</title>
        <base href="/">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- NB: syntax highlighting style can be changed at https://github.com/isagalaev/highlight.js/tree/master/src/styles -->
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-light.min.css">
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-111993888-1"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-111993888-1');
        </script>
      </head>
      <body ng-app="app" ng-strict-di ng-cloak>
        <app>
          <div id="app">
            <!-- Temporary improvement of "Loading" placeholder -->
            <h1 style="
              font-family: 'Helvetica Neue', Arial, san-serif;
              font-size: 44px;
              font-weight: 100;
              letter-spacing: 0.4px;
              margin-left: 40px;
              margin-top: 24px;
            ">
              Loading...
            </h1>
          </div>
        </app>

        <script
          type="text/javascript"
          src="bundle.js"
          charset="utf-8">
        </script>
      </body>
    </html>
  `;
};

module.exports = {
  template
};
