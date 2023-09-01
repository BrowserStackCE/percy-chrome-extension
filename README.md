This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!

## Known Issues in M2 Mac

After `npm install` when the plasmo development server is started with the command `npm run dev` for this project, there is possibilities that the following issues may occur:

## Issue 1

If you encounter the following error:

```shell
npm ERR! [esbuild] Failed to find package "@esbuild/darwin-arm64" on the file system
```

To resolve this, install the missing package:

```shell
npm i @esbuild/darwin-arm64
```

## Issue 2

If you come across the following error:

```shell
Error: No prebuild or local build of @parcel/watcher found.
```

You can resolve it by installing the required package:

```shell
npm install @parcel/watcher
```

After installing @parcel/watcher, If you still face an issue like:

```shell
Could not resolve module "../lightningcss.darwin-arm64.node" from "../node_modules/lightningcss/node/index.js"
```

Install the package lightningcss:

```shell
npm i lightningcss
```

After resolving the mentioned issues, you can run the project using the following command:

```shell
npm run dev
```

Upon successful execution, you should see the message:

```shell
Extension re-packaged
```
