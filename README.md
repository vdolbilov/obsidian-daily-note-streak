# Daily note writing streak

Display your writing streak in the status bar. Meant to be paired with the core [daily note plugin](https://help.obsidian.md/plugins/daily-notes).

<img width="374" alt="Screenshot 2025-05-30 at 10 14 34 PM" src="https://github.com/user-attachments/assets/e18573ea-c3bb-4aa8-b066-92e8f74352d7" />

This plugin expects there to be one file per day because it doesn't track multiple changes to a file.

## Features
- Shows current streak in status bar (e.g. "🔥 5 days")
- Configurable folder to monitor
- Updates automatically on file changes
- Smart streak calculation (handles same-day/previous-day writing)

## Configuration
Set your target folder in Settings → Writing Streak. Leave empty to monitor all files.

## Troubleshooting
- Ensure folder path is correct
- Try refreshing the plugin
- Check file timestamps if streak seems wrong
- Manually refresh the streak

### Manual refresh

You can manually refresh the streak by:
- Using the command palette: "Refresh writing streak"
- Clicking the "Refresh" button in the plugin settings

## Streak logic

The streak counter:
- **Starts counting** from consecutive days with file activity
- **Continues** as long as you have file activity each day
- **Tracks** both the created date and last updated date of a file
- **Breaks** if there's a gap of more than one day without activity
- **Allows flexibility** by checking both today and yesterday to account for different writing schedules

