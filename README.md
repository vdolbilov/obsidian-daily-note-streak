# Writing Streak Plugin

A simple Obsidian plugin that displays your writing streak in the status bar. The streak counts consecutive days where you've created or modified files in a specified folder.

## Features

- **Status Bar Display**: Shows your current writing streak (e.g., "🔥 5 days") in the bottom status bar
- **Configurable Folder**: Choose which folder to monitor for writing activity
- **Automatic Updates**: Streak updates automatically when you create or modify files
- **Smart Streak Logic**: Counts consecutive days with writing activity, allowing for same-day or previous-day writing

## How It Works

The plugin tracks your writing streak by:

1. Monitoring files in your specified folder (or all files if no folder is set)
2. Checking file creation and modification dates
3. Counting consecutive days with file activity, working backwards from today
4. Displaying the current streak in the status bar with a fire emoji

## Installation

### Manual Installation

1. Download the latest release files (`main.js`, `manifest.json`, `styles.css`)
2. Create a folder called `writing-streak` in your vault's `.obsidian/plugins/` directory
3. Place the downloaded files in the `writing-streak` folder
4. Reload Obsidian or enable the plugin in Settings → Community Plugins

### Development Installation

1. Clone this repository to your vault's `.obsidian/plugins/` directory
2. Run `npm install` to install dependencies
3. Run `npm run build` to compile the plugin
4. Reload Obsidian or enable the plugin in Settings → Community Plugins

## Configuration

1. Go to Settings → Community Plugins → Writing Streak → Options
2. Set your **Folder path** (e.g., "Daily Notes", "Journal", or leave empty for all files)
3. The streak will update automatically

## Usage

Once configured, the plugin will:

- Show your streak in the status bar (bottom of the screen)
- Update automatically when you create or modify files
- Reset to 0 if you miss a day (no file activity yesterday or today)

### Manual Refresh

You can manually refresh the streak by:
- Using the command palette: "Refresh writing streak"
- Clicking the "Refresh" button in the plugin settings

## Streak Logic

The streak counter:
- **Starts counting** from consecutive days with file activity
- **Continues** as long as you have file activity each day
- **Breaks** if there's a gap of more than one day without activity
- **Allows flexibility** by checking both today and yesterday to account for different writing schedules

## Examples

- **Folder setting**: "Daily Notes" - only counts files in your Daily Notes folder
- **Empty folder**: Counts all markdown files in your vault
- **Nested folders**: "Journal/2024" - counts files in that specific subfolder

## Troubleshooting

**Streak not updating?**
- Check that your folder path is correct in settings
- Try manually refreshing using the command palette
- Ensure you're creating/modifying files in the monitored folder

**Streak seems wrong?**
- The plugin uses file creation and modification timestamps
- Moving or copying files may affect their timestamps
- Use the manual refresh if needed

## Contributing

This is an open-source project. Feel free to contribute by:
- Reporting bugs or requesting features
- Submitting pull requests
- Improving documentation

## License

MIT License - see LICENSE file for details