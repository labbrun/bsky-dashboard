/**
 * Settings Backup and Restore Utilities
 * Provides functionality to backup and restore user settings to prevent data loss
 */

import { getCredentials, saveCredentials } from '../services/credentialsService';

/**
 * Export all settings to a JSON file for backup
 */
export const exportSettings = () => {
  try {
    const settings = getCredentials();
    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      settings: settings
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `bsky-dashboard-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Failed to export settings:', error);
    return false;
  }
};

/**
 * Import settings from a JSON backup file
 */
export const importSettings = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const backup = JSON.parse(e.target.result);

        if (!backup.settings) {
          throw new Error('Invalid backup file format');
        }

        const success = await saveCredentials(backup.settings);
        if (success) {
          // Trigger a page refresh to reload settings
          window.location.reload();
          resolve(true);
        } else {
          reject(new Error('Failed to save imported settings'));
        }
      } catch (error) {
        reject(new Error(`Failed to import settings: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read backup file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Create an automatic backup of current settings to localStorage with timestamp
 */
export const createAutoBackup = () => {
  try {
    const settings = getCredentials();
    if (Object.keys(settings).length > 0) {
      const backup = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        settings: settings
      };
      localStorage.setItem('bsky-dashboard-auto-backup', JSON.stringify(backup));
      return true;
    }
  } catch (error) {
    console.error('Failed to create auto backup:', error);
  }
  return false;
};

/**
 * Restore from automatic backup if available
 */
export const restoreFromAutoBackup = async () => {
  try {
    const backup = localStorage.getItem('bsky-dashboard-auto-backup');
    if (backup) {
      const parsed = JSON.parse(backup);
      if (parsed.settings && Object.keys(parsed.settings).length > 0) {
        const success = await saveCredentials(parsed.settings);
        if (success) {
          console.log('Settings restored from auto backup');
          return true;
        }
      }
    }
  } catch (error) {
    console.error('Failed to restore from auto backup:', error);
  }
  return false;
};

/**
 * Check if settings appear to be missing and offer restoration
 */
export const checkForMissingSettings = () => {
  const currentSettings = getCredentials();
  const hasSettings = Object.keys(currentSettings).length > 0;

  if (!hasSettings) {
    const backup = localStorage.getItem('bsky-dashboard-auto-backup');
    if (backup) {
      try {
        const parsed = JSON.parse(backup);
        return {
          hasMissingSettings: true,
          backupAvailable: true,
          backupTimestamp: parsed.timestamp
        };
      } catch (error) {
        return {
          hasMissingSettings: true,
          backupAvailable: false
        };
      }
    }
    return {
      hasMissingSettings: true,
      backupAvailable: false
    };
  }

  return {
    hasMissingSettings: false,
    backupAvailable: false
  };
};