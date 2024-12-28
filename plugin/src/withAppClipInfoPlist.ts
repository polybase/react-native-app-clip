import {  withInfoPlist, type ConfigPlugin } from "@expo/config-plugins";
import path from 'node:path'
import fs from 'node:fs'

const updateNativeAppClipCFBundleShortVersionString = (mainAppCFBundleShortVersionString: string, nativeAppClipInfoPlistPath: string) => {
  if (fs.existsSync(nativeAppClipInfoPlistPath)) {
    let infoPlist = fs.readFileSync(nativeAppClipInfoPlistPath, 'utf8');

    // Update or add CFBundleShortVersionString
    if (infoPlist.includes('<key>CFBundleShortVersionString</key>')) {
      // If key exists, replace the current version number
      infoPlist = infoPlist.replace(
        /<key>CFBundleShortVersionString<\/key>\s*<string>.*<\/string>/,
        `<key>CFBundleShortVersionString</key>\n\t<string>${mainAppCFBundleShortVersionString}</string>`
      );
    } else {
      // If key doesn't exist, add it
      infoPlist = infoPlist.replace(
        '</dict>',
        `<key>CFBundleShortVersionString</key>\n\t<string>${mainAppCFBundleShortVersionString}</string>\n</dict>`
      );
    }

    // Write the updated Info.plist back to the file
    fs.writeFileSync(nativeAppClipInfoPlistPath, infoPlist, 'utf8');
  } else {
    throw new Error(`Info.plist not found at ${nativeAppClipInfoPlistPath}`);
  }
}

// Update the Native app clip's `CFBundleShortVersionString` to match the parent app.
export const withAppClipInfoPlist: ConfigPlugin<{
  targetName: string;
}> = (
  config,
  { targetName },
) => {
  return withInfoPlist(config, (config) => {
    const mainAppCFBundleShortVersionString = config.modResults.CFBundleShortVersionString ?? '1.0.0'
    console.log(`[withNativeAppClipInfoplist] mainAppCFBundleShortVersionString = ${mainAppCFBundleShortVersionString}`)

    const nativeAppClipInfoPlistPath = path.join(
      config.modRequest.platformProjectRoot,
      targetName,
      "Info.plist")
    console.log(`[withNativeAppClipInfoplist] nativeAppClipInfoPlistPath = ${nativeAppClipInfoPlistPath}`)

    updateNativeAppClipCFBundleShortVersionString(mainAppCFBundleShortVersionString, nativeAppClipInfoPlistPath)

    return config;
  });
};
