const { getDefaultConfig } = require("expo/metro-config");

/**
 * Minimal metro config compatible with Reanimated and managed workflow.
 */
/* eslint-env node */
const config = getDefaultConfig(__dirname);

module.exports = config;
