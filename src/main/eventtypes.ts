// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Note: keep this file minimal since it is bundled into preload.js

// events sent to Main process
export enum EventTypeMain {
  MinimizeWindow = 'minimize-window',
  MaximizeWindow = 'maximize-window',
  RestoreWindow = 'restore-window',
  CloseWindow = 'close-window',
  OpenFileOrFolder = 'open-file-or-folder',
  OpenFile = 'open-file',
  OpenFolder = 'open-folder',
  CreateNewSession = 'create-new-session',
  CreateNewRemoteSession = 'create-new-remote-session',
  OpenRecentSession = 'open-recent-session',
  OpenRecentSessionWithDefaultEnv = 'open-recent-session-with-default-env',
  DeleteRecentSession = 'delete-recent-session',
  OpenDroppedFiles = 'open-dropped-files',
  OpenNewsLink = 'open-news-link',
  SetSessionPythonPath = 'set-session-python-path',
  ShowEnvSelectPopup = 'show-env-select-popup',
  HideEnvSelectPopup = 'hide-env-select-popup',
  SetRemoteServerOptions = 'set-remote-server-options',
  ShowAppContextMenu = 'show-app-context-menu',
  HideProgressView = 'hide-progress-view',
  ShowWelcomeView = 'show-welcome-view',
  ShowServerSettings = 'show-server-settings',
  TitleBarMouseEvent = 'titlebar-mouse-event',
  DeleteRecentRemoteURL = 'delete-recent-remote-url',
  LabUIReady = 'lab-ui-ready',
  SetTheme = 'set-theme',
  SetCheckForUpdatesAutomatically = 'set-check-for-updates-automatically',
  SetInstallUpdatesAutomatically = 'set-install-updates-automatically',
  LaunchInstallerDownloadPage = 'launch-installer-download-page',
  LaunchAboutJupyterPage = 'launch-about-jupyter-page',
  SelectWorkingDirectory = 'select-working-directory',
  SetDefaultWorkingDirectory = 'set-default-working-directory',
  SelectPythonPath = 'select-python-path',
  InstallBundledPythonEnv = 'install-bundled-python-env',
  ValidatePythonPath = 'validate-python-path',
  ValidateRemoteServerUrl = 'validate-remote-server-url',
  SetDefaultPythonPath = 'set-default-python-path',
  SetStartupMode = 'set-startup-mode',
  SetSyncJupyterLabTheme = 'set-sync-jupyterlab-theme',
  SetShowNewsFeed = 'set-show-news-feed',
  RestartApp = 'restart-app',
  CheckForUpdates = 'check-for-updates',
  GetServerInfo = 'get-server-info',
  IsDarkTheme = 'is-dark-theme',
  ClearHistory = 'clear-history',
  ShowInvalidPythonPathMessage = 'show-invalid-python-path-message',
  SetLogLevel = 'set-log-level',
  SetServerLaunchArgs = 'set-server-launch-args',
  SetServerEnvVars = 'set-server-env-vars',
  SetCtrlWBehavior = 'set-ctrl-w-behavior',
  SetAuthDialogResponse = 'set-auth-dialog-response',
  InstallPythonEnvRequirements = 'install-python-env-requirements',
  ShowLogs = 'show-logs',
  CopyToClipboard = 'copy-to-clipboard',
  GetNextPythonEnvironmentName = 'get-next-python-environment-name',
  CreateNewPythonEnvironment = 'create-new-python-environment',
  ShowManagePythonEnvironmentsDialog = 'show-manage-python-environments-dialog',
  SelectDirectoryPath = 'select-directory',
  SelectFilePath = 'select-file',
  ShowPythonEnvironmentContextMenu = 'show-python-environment-context-menu',
  DeletePythonEnvironment = 'delete-python-environment',
  GetPythonEnvironmentList = 'get-python-environment-list',
  GetEnvironmentByPythonPath = 'get-environment-by-python-path',
  AddEnvironmentByPythonPath = 'add-environment-by-python-path',
  ValidateNewPythonEnvironmentName = 'validate-new-env-name',
  ValidatePythonEnvironmentInstallDirectory = 'validate-python-envs-directory',
  SetPythonEnvironmentInstallDirectory = 'set-python-envs-directory',
  ValidateCondaPath = 'validate-conda-path',
  SetCondaPath = 'set-conda-path',
  ValidateSystemPythonPath = 'validate-system-python-path',
  SetSystemPythonPath = 'set-system-python-path',
  CopySessionInfoToClipboard = 'copy-session-info-to-clipboard'
}

// events sent to Renderer process
export enum EventTypeRenderer {
  WorkingDirectorySelected = 'working-directory-selected',
  InstallPythonEnvStatus = 'install-python-env-status',
  CustomPythonPathSelected = 'custom-python-path-selected',
  ShowProgress = 'show-progress',
  SetCurrentPythonPath = 'set-current-python-path',
  UpdateRecentRemoteURLs = 'update-recent-remote-urls',
  SetRunningServerList = 'set-running-server-list',
  SetTitle = 'set-title',
  SetActive = 'set-active',
  ShowServerStatus = 'show-server-status',
  SetRecentSessionList = 'set-recent-session-list',
  SetNewsList = 'set-news-list',
  SetNotificationMessage = 'set-notification-message',
  DisableLocalServerActions = 'disable-local-server-actions',
  SetDefaultWorkingDirectoryResult = 'set-default-working-directory-result',
  ResetPythonEnvSelectPopup = 'reset-python-env-select-popup',
  SetPythonEnvironmentList = 'set-python-environment-list',
  SetEnvironmentListUpdateStatus = 'set-environment-list-update-status'
}
