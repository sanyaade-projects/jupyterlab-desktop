// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs';
import { ThemedView } from '../dialog/themedview';
import { EventTypeRenderer } from '../eventtypes';
import { IPythonEnvironment } from '../tokens';
import { IApplication } from '../app';

export class PythonEnvironmentSelectPopup {
  constructor(options: PythonEnvironmentSelectView.IOptions) {
    this._app = options.app;
    this._view = new ThemedView({
      isDarkTheme: options.isDarkTheme,
      preload: path.join(__dirname, './preload.js')
    });

    const { envs, defaultPythonPath, bundledPythonPath } = options;
    this._envs = options.envs;
    const currentPythonPath = options.currentPythonPath || '';

    const uFuzzyScriptSrc = fs.readFileSync(
      path.join(__dirname, '../../../app-assets/uFuzzy.iife.min.js')
    );
    const copyIconSrc = fs.readFileSync(
      path.join(__dirname, '../../../app-assets/copy-icon.svg')
    );
    const xMarkIconSrc = fs.readFileSync(
      path.join(__dirname, '../../../app-assets/xmark.svg')
    );

    const template = `
      <style>
        body {
          border-right: 1px solid #999999;
          border-bottom: 1px solid #999999;
          border-left: 1px solid #999999;
        }
        body.app-ui-dark {
          border-right: 1px solid #555555;
          border-bottom: 1px solid #555555;
          border-left: 1px solid #555555;
        }
        .row {display: flex; align-items: center;}
        .row.error {color: rgb(231, 92, 88);}
        .radio-row {align-items: center;}
        #header {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--neutral-foreground-hint);
        }
        #restart-title {
          flex-grow: 1;
          margin-left: 5px;
          height: 30px;
          line-height: 30px;
          font-weight: bold;
        }
        #close-button, #copy-button {
          cursor: pointer;
        }
        #close-button svg {
          width: 18px;
          height: 18px;
        }
        #copy-button svg {
          width: 16px;
          height: 16px;
        }
        #close-button svg path, #copy-button svg path {
          fill: var(--neutral-foreground-hint);
        }
        #close-button:hover svg path, #copy-button:hover svg path {
          fill: var(--neutral-foreground-rest);
        }
        #copy-button:active svg path {
          fill: var(--accent-foreground-active);
        }
        #python-path {
          outline: none;
        }
        #python-path::part(control) {
          padding-right: 50px;
        }
        #browse-button {
          width: 30px;
          position: absolute;
          margin: 10px;
          right: 0;
          height: 30px;
        }
        input {
          color-scheme: light;
        }
        .app-ui-dark input {
          color-scheme: dark;
        }
        .footer-row {
          margin-bottom: 5px;
          height: 40px;
          overflow-y: hidden;
          justify-content: flex-end;
        }
        #env-list {
          max-width: 100%;
          width: 100%;
          box-shadow: none;
        }
        jp-menu {
          background: none;
        }
        jp-menu-item.active {
          background: var(--neutral-layer-3);
        }
        jp-menu-item::part(content) {
          width: 100%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        jp-menu-item::part(end) {
          margin-left: 10px;
        }
      </style>
      <script>${uFuzzyScriptSrc}</script>
      <div style="height: 100%; display: flex; flex-direction: column; row-gap: 5px;">
        <div id="header">
          <div id="restart-title">
            Restart session using a different Python environment
          </div>
          <div id="copy-button" onclick='handleCopySessionInfo();' title="Copy session info to clipboard">
            ${copyIconSrc}
          </div>
          <div id="close-button" onclick='window.electronAPI.hideEnvSelectPopup();' title="Close menu">
            ${xMarkIconSrc}
          </div>
        </div>
        <div>
          <div style="display: flex; flex-direction: row; align-items: center; flex-grow: 1;">
            <jp-text-field type="text" id="python-path" style="width: 100%;" spellcheck="false" required placeholder="type to filter Python paths">
            </jp-text-field>
            <jp-button id="browse-button" appearance="accent" onclick='handleManagePythonEnvs(this);' title="Manage Python environments"><svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg></jp-button>
          </div>
        </div>
        <div style="flex-grow: 1; overflow-x: hidden; overflow-y: auto;">
          <jp-menu id="env-list"></jp-menu>
        </div>
      </div>

      <script>
        let currentPythonPath = "<%- currentPythonPath %>;";
        const pythonPathInput = document.getElementById('python-path');
        const envListMenu = document.getElementById('env-list');
        let envs = <%- JSON.stringify(envs) %>;
        let activeIndex = -1;
        let envPaths = envs.map(env => env.path);
        let filteredEnvIndixes = [];
        const uf = new uFuzzy({
          intraChars: "[A-Za-z0-9_]",
          intraIns: 10,
          intraMode: 0,
        });

        function getEnvTooltip(env) {
          const packages = [];
          for (const name in env.versions) {
            packages.push(name + ': ' + env.versions[name]);
          }
          return env.name + '\\n' + env.path + '\\n' + packages.join(', ');
        }

        function generateMenuItem(env, higlightRanges) {
          const envPath = env.path;
          const hilitedEnvPath = higlightRanges ? uFuzzy.highlight(envPath, higlightRanges) : envPath;
          const envName = env.name;
          const flag = envPath === currentPythonPath ? ' (current)' : envPath === "${defaultPythonPath}" ? ' (default)' : envPath === "${bundledPythonPath}" ? ' (bundled)' : '';
          return \`<jp-menu-item data-python-path="\$\{envPath\}" onclick="onMenuItemClicked(this);" title="\$\{getEnvTooltip(env)\}">\$\{hilitedEnvPath\}
                <div slot="end">\$\{envName\}\$\{flag\}
                </div>
              </jp-menu-item>\`;
        }

        function updateMenu(filterOrder, filterInfo) {
          let html = '';

          if (filterOrder && filterInfo) {
            for (let i = 0; i < filterOrder.length; i++) {
              const infoIdx = filterOrder[i];
              html += generateMenuItem(envs[filterInfo.idx[infoIdx]], filterInfo.ranges[infoIdx]);
            }
          } else {
            for (const env of envs) {
              html += generateMenuItem(env);
            }
          }

          envListMenu.innerHTML = html;
        }

        function handleCopySessionInfo() {
          window.electronAPI.copySessionInfo();
        }

        window.electronAPI.onResetPythonEnvSelectPopup((path) => {
          pythonPathInput.value = '';
          activeIndex = 0;
          filterEnvironmentList();
          updateActiveItem();
          pythonPathInput.focus();
        });

        window.electronAPI.onCurrentPythonPathSet((path) => {
          currentPythonPath = path;
        });

        window.electronAPI.onSetPythonEnvironmentList((newEnvs) => {
          envs = newEnvs;
          envPaths = envs.map(env => env.path);
          pythonPathInput.value = '';
          updateMenu();
        });

        function onMenuItemClicked(el) {
          const pythonPath = el.dataset.pythonPath;
          window.electronAPI.setSessionPythonPath(pythonPath);
        }

        function handleManagePythonEnvs(el) {
          window.electronAPI.hideEnvSelectPopup();
          window.electronAPI.showManagePythonEnvsDialog();
        }

        function updateActiveItem() {
          document.querySelectorAll('jp-menu-item').forEach((item) => {
            item.classList.remove('active');
          });

          const activeItem = envListMenu.children[activeIndex];
          activeItem.scrollIntoView();
          activeItem.classList.add('active');
        }

        function filterResults() {
          const input = pythonPathInput.value;
          return input.trim() !== '';
        }

        function filterEnvironmentList() {
          if (!filterResults()) {
            updateMenu();
            return;
          }

          const input = pythonPathInput.value;
          filteredEnvIndixes = uf.filter(envPaths, input);
          const info = uf.info(filteredEnvIndixes, envPaths, input);
          const order = uf.sort(info, envPaths, input);

          updateMenu(order, info);
        }

        document.addEventListener("DOMContentLoaded", () => {
          updateMenu();

          pythonPathInput.control.onkeydown = (event) => {
            const numEnvs = envs.length;
            const numFilteredEnvs = filterResults() ? filteredEnvIndixes.length : numEnvs;
            if (event.key === "Enter") {
              if (numFilteredEnvs > 0) {
                const menuItems = document.querySelectorAll('jp-menu-item');
                const activeMenuItem = menuItems[activeIndex];
                window.electronAPI.setSessionPythonPath(activeMenuItem.dataset.pythonPath);
              }
            } else if (event.key === "Escape") {
              window.electronAPI.hideEnvSelectPopup();
            } else if (event.key === "ArrowDown") {
              if (numFilteredEnvs == 0) {
                return;
              }
              if (activeIndex === -1) {
                activeIndex = 0;
              } else {
                activeIndex = (activeIndex + 1) % numFilteredEnvs;
              }
              updateActiveItem();
            } else if (event.key === "ArrowUp") {
              if (numFilteredEnvs == 0) {
                return;
              }
              if (activeIndex === -1) {
                activeIndex = numFilteredEnvs - 1;
              } else {
                activeIndex = (activeIndex - 1 + numFilteredEnvs) % numFilteredEnvs;
              }
              updateActiveItem();
            }
          };

          pythonPathInput.control.oninput = (event) => {
            activeIndex = 0;
            filterEnvironmentList();
          };

          window.onkeydown = (event) => {
            if (event.key === "Escape") {
              window.electronAPI.hideEnvSelectPopup();
            }
          };

          setTimeout(() => {
            pythonPathInput.focus();
          }, 500);
        });
      </script>
        `;
    this._pageBody = ejs.render(template, {
      currentPythonPath,
      envs
    });
  }

  get view(): ThemedView {
    return this._view;
  }

  load() {
    this._view.loadViewContent(this._pageBody);

    this._app.registry.environmentListUpdated.connect(
      this._onEnvironmentListUpdated,
      this
    );
  }

  setCurrentPythonPath(currentPythonPath: string) {
    this._view.view.webContents.send(
      EventTypeRenderer.SetCurrentPythonPath,
      currentPythonPath
    );
  }

  resetView() {
    this._view.view.webContents.send(
      EventTypeRenderer.ResetPythonEnvSelectPopup
    );
  }

  getScrollHeight(): number {
    const envCount = this._envs.length;
    return (
      30 + // title
      40 + // path input
      (envCount > 0 ? envCount * 40 + 14 : 0) + // env list
      17 // padding
    );
  }

  setPythonEnvironmentList(envs: IPythonEnvironment[]) {
    this._envs = envs;
    this._view.view.webContents.send(
      EventTypeRenderer.SetPythonEnvironmentList,
      envs
    );
  }

  private async _onEnvironmentListUpdated() {
    const envs = await this._app.registry.getEnvironmentList(true);
    this.setPythonEnvironmentList(envs);
  }

  private _view: ThemedView;
  private _pageBody: string;
  private _envs: IPythonEnvironment[];
  private _app: IApplication;
}

export namespace PythonEnvironmentSelectView {
  export interface IOptions {
    app: IApplication;
    isDarkTheme: boolean;
    envs: IPythonEnvironment[];
    bundledPythonPath: string;
    defaultPythonPath: string;
    currentPythonPath?: string;
  }
}
