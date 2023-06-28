<a href="https://marketplace.visualstudio.com/items?itemName=jake-demian.project-hierarchy-explorer" style="display: none;">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jakedemian/project-hierarchy-explorer/main/images/icon.png" width="140">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jakedemian/project-hierarchy-explorer/main/images/icon.png" width="140">
    <img src="https://raw.githubusercontent.com/jakedemian/project-hierarchy-explorer/main/images/blank.png" alt="Logo">
  </picture>
</a>

# Project Hierarchy Explorer

![Size](https://img.shields.io/github/languages/code-size/jakedemian/project-hierarchy-explorer)
[![Visual Studio Code](https://img.shields.io/badge/--007ACC?logo=visual%20studio%20code&logoColor=ffffff)](https://marketplace.visualstudio.com/items?itemName=jake-demian.project-hierarchy-explorer)&nbsp;
[![GitHub license](https://badgen.net/github/license/jakedemian/project-hierarchy-explorer)](https://github.com/jakedemian/project-hierarchy-explorer/blob/main/LICENSE.md)&nbsp;
[![GitHub stars](https://img.shields.io/github/stars/jakedemian/project-hierarchy-explorer.svg?style=social&label=Star)](https://GitHub.com/jakedemian/project-hierarchy-explorer/stargazers/)
[![Checks](https://github.com/jakedemian/project-hierarchy-explorer/actions/workflows/checks.yml/badge.svg)](https://github.com/jakedemian/project-hierarchy-explorer/actions/workflows/checks.yml)
![Ratings](https://img.shields.io/visual-studio-marketplace/r/jake-demian.project-hierarchy-explorer)

Project Hierarchy Explorer provides a command that outputs the hierarchy of your project to either a file or the output console. Easily share and discuss your project structure with other contributors, or give it to your favorite AI for greatly improved clarity in your prompts.

![Alt text](images/project-hierarchy-animation.gif)

## Features

- Generates a project hierarchy that includes all files and directories, excluding those specified in the `ignorePatterns` setting.
- The hierarchy is generated in a tree-like structure, providing a clear view of the project's structure.

## Usage

1. Open the command palette with `Ctrl+Shift+P` (or `F1`)
2. Search for and run `Project Hierarchy Explorer: Generate`

![Alt text](images/command.png)

3. View the output file at the root of your project, or check the console output (depending on your [configuration](#configuration-options)).

![Alt text](images/sample.png)

## Configuration Options

All configurations are prepended with `project-hierarchy-explorer`, for example:

```
project-hierarchy-explorer.ignorePatterns
```

### Configurations

### `ignorePatterns`

The `ignorePatterns` setting can be added to your workspace or user settings to ignore specific files or directories when generating the project hierarchy. It uses the glob pattern syntax.

For example:

```json
"project-hierarchy-explorer.ignorePatterns": [".git", "node_modules", "*.js.map"]
```

This will ignore any .git directories and node_modules directories when generating the project hierarchy.

### `outputsTo`

Represents where you would like to output the project hierarchy to.

Valid values are: `'file'` (default), `'console'`, and `'both'`

### `suppressNotification`

The `suppressNotification` setting is useful when generating the project hierarchy in a build pipeline or as a task.

```json
"project-hierarchy-explorer.suppressNotification": true
```

This will prevent the notification from appearing after the project hierarchy is generated.

## Run As Task

To run the Generate command as a task create a `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Generate Project Hierarchy",
      "type": "shell",
      "command": "${input:generateProjectHierarchy}",
      "problemMatcher": []
    }
  ],
  "inputs": [
    {
      "id": "generateProjectHierarchy",
      "type": "command",
      "command": "project-hierarchy-explorer.generate"
    }
  ]
}
```

This can be very powerful when used for validation with something like chatGpt.

## Contribute

https://github.com/jakedemian/project-hierarchy-explorer

## License

### MIT

This project uses the MIT License. Please review the [MIT License](LICENSE.md) for details.
