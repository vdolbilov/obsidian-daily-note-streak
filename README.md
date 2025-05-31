# Writing Streak Plugin

An Obsidian plugin that displays your writing streak in the status bar.

## Features
- Shows current streak in status bar (e.g. "🔥 5 days")
- Configurable folder to monitor
- Updates automatically on file changes
- Smart streak calculation (handles same-day/previous-day writing)

## Installation
1. Install via Obsidian Community Plugins
2. Enable plugin in Settings
3. Optionally configure folder path

## Configuration
Set your target folder in Settings → Writing Streak. Leave empty to monitor all files.

## Usage
The streak updates automatically when you create or modify files. Click the status bar item to refresh.

## Troubleshooting
- Ensure folder path is correct
- Try refreshing the plugin
- Check file timestamps if streak seems wrong

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
