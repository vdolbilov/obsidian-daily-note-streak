import {
	App,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
	moment,
} from 'obsidian';

interface WritingStreakSettings {
	folderPath: string;
	streakStartDate: string;
	oneDayGrace: boolean;
}

const DEFAULT_SETTINGS: WritingStreakSettings = {
	folderPath: '',
	streakStartDate: '',
	oneDayGrace: false,
};

export default class WritingStreakPlugin extends Plugin {
	settings: WritingStreakSettings;
	statusBarItem: HTMLElement;

	async onload() {
		await this.loadSettings();

		// Add status bar item
		this.statusBarItem = this.addStatusBarItem();
		this.updateStreakDisplay();

		// Update streak when files are created or modified
		this.registerEvent(
			this.app.vault.on('create', (file) => {
				if (file instanceof TFile && this.isFileInTargetFolder(file)) {
					this.updateStreakDisplay();
				}
			}),
		);

		this.registerEvent(
			this.app.vault.on('modify', (file) => {
				if (file instanceof TFile && this.isFileInTargetFolder(file)) {
					this.updateStreakDisplay();
				}
			}),
		);

		// Add settings tab
		this.addSettingTab(new WritingStreakSettingTab(this.app, this));

		// Add command to manually refresh streak
		this.addCommand({
			id: 'refresh-writing-streak',
			name: 'Refresh writing streak',
			callback: () => {
				this.updateStreakDisplay();
			},
		});
	}

	onunload() {
		if (this.statusBarItem) {
			this.statusBarItem.remove();
		}
	}

	isFileInTargetFolder(file: TFile): boolean {
		if (!this.settings.folderPath) {
			// If no folder specified, check all files
			return true;
		}

		const normalizedFolderPath = this.settings.folderPath.replace(
			/^\/+|\/+$/g,
			'',
		);
		const fileFolderPath = file.parent?.path || '';

		if (normalizedFolderPath === '') {
			return fileFolderPath === '';
		}

		return (
			fileFolderPath === normalizedFolderPath ||
			fileFolderPath.startsWith(normalizedFolderPath + '/')
		);
	}

	async updateStreakDisplay() {
		try {
			const streak = await this.calculateStreak();
			this.statusBarItem.setText(
				`🔥 ${streak} day${streak !== 1 ? 's' : ''}`,
			);
			this.statusBarItem.addClass('writing-streak-status');
		} catch (error) {
			console.error(
				'Writing Streak: Error updating streak display:',
				error,
			);
			this.statusBarItem.setText('🔥 Error');
		}
	}

	async calculateStreak(): Promise<number> {
		try {
			const files = this.app.vault.getMarkdownFiles();
			const targetFiles = files.filter((file) =>
				this.isFileInTargetFolder(file),
			);

			if (targetFiles.length === 0) return 0;

			const dates = new Set<string>();
			for (const file of targetFiles) {
				const stat = await this.app.vault.adapter.stat(file.path);
				if (stat) {
					dates.add(moment(stat.ctime).format('YYYY-MM-DD'));
					dates.add(moment(stat.mtime).format('YYYY-MM-DD'));
				}
			}

			const sortedDates = Array.from(dates).sort().reverse();
			if (sortedDates.length === 0) return 0;

			let streak = 0;
			let currentDate = moment();

			const MAX_STREAK = 99999;
			while (streak < MAX_STREAK) {
				const dateStr = currentDate.format('YYYY-MM-DD');

				if (sortedDates.includes(dateStr)) {
					streak++;
					currentDate.subtract(1, 'day');
				} else if (this.settings.oneDayGrace) {
					// Skip this day and try the next
					currentDate.subtract(1, 'day');
					const nextDateStr = currentDate.format('YYYY-MM-DD');
					if (sortedDates.includes(nextDateStr)) {
						streak++;
						currentDate.subtract(1, 'day');
					} else {
						break;
					}
				} else {
					// No grace period, streak ends
					break;
				}
			}

			return streak;
		} catch (error) {
			console.error('Error calculating streak:', error);
			return 0;
		}
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class WritingStreakSettingTab extends PluginSettingTab {
	plugin: WritingStreakPlugin;

	constructor(app: App, plugin: WritingStreakPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.addClass('writing-streak-settings');

		containerEl.createEl('h2', { text: 'Writing Streak Settings' });

		new Setting(containerEl)
			.setName('Folder path')
			.setDesc(
				'Specify the folder to monitor for writing activity. Leave empty to monitor all files. Use forward slashes for nested folders (e.g., "Journal/2024").',
			)
			.addText((text) =>
				text
					.setPlaceholder('e.g., Daily Notes')
					.setValue(this.plugin.settings.folderPath)
					.onChange(async (value) => {
						this.plugin.settings.folderPath = value.trim();
						await this.plugin.saveSettings();
						await this.plugin.updateStreakDisplay();
						this.showStreakInSettings(containerEl);
					}),
			);

		new Setting(containerEl)
			.setName('One day grace')
			.setDesc('Allows streaks to continue when missing 1 day.')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.oneDayGrace)
					.onChange(async (value) => {
						this.plugin.settings.oneDayGrace = value;
						await this.plugin.saveSettings();
						await this.plugin.updateStreakDisplay();
						this.showStreakInSettings(containerEl);
					}),
			);

		new Setting(containerEl)
			.setName('Refresh streak')
			.setDesc(
				'Manually refresh the streak counter to update the display immediately',
			)
			.addButton((button) =>
				button
					.setButtonText('Refresh')
					.setClass('writing-streak-refresh-btn')
					.setCta()
					.onClick(async () => {
						await this.plugin.updateStreakDisplay();
						this.showStreakInSettings(containerEl);
					}),
			);

		// Display current streak info

		this.showStreakInSettings(containerEl);
	}

	showStreakInSettings(containerEl: HTMLElement) {
		containerEl.find('.settings-streak')?.remove();

		this.plugin.calculateStreak().then((streak) => {
			const currentStreakDiv = containerEl.createDiv();
			currentStreakDiv.className = 'settings-streak';

			currentStreakDiv.createDiv({
				text: `Current streak: 🔥 ${streak} day${streak !== 1 ? 's' : ''}`,
			});
			currentStreakDiv.createEl('small', {
				text: `Monitoring folder: ${this.plugin.settings.folderPath || 'All files'}`,
			});
		});
	}
}
