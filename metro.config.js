const { getDefaultConfig } = require('expo/metro-config');

/**
 * Minimal metro config compatible with Reanimated and managed workflow.
 */
const config = getDefaultConfig(__dirname);

module.exports = config;
