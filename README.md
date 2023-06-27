# Project Hierarchy Explorer

🔗 [View on Visual Studio Code Extensions Marketplace](https://marketplace.visualstudio.com/items?itemName=jake-demian.project-hierarchy-explorer)

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

## Contribute

https://github.com/jakedemian/project-hierarchy-explorer

## License

### MIT

This project uses the MIT License. Please review the [MIT License](LICENSE.md) for details.
