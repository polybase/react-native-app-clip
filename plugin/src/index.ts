import { IOSConfig, withPlugins, type ConfigPlugin } from "expo/config-plugins";

import { withConfig } from "./withConfig";
import { withEntitlements } from "./withEntitlements";
import { withXcode } from "./withXcode";

const withAppClip: ConfigPlugin<{
  name?: string;
  nativeClipSrcRootDir: string;
  bundleIdSuffix?: string;
  targetSuffix?: string;
  groupIdentifier?: string;
  deploymentTarget?: string;
  requestEphemeralUserNotification?: boolean;
  requestLocationConfirmation?: boolean;
  appleSignin?: boolean;
  applePayMerchantIds?: string[];
  excludedPackages?: string[];
}> = (
  config,
  {
    name,
    nativeClipSrcRootDir,
    bundleIdSuffix,
    targetSuffix,
    groupIdentifier,
    deploymentTarget,
    requestEphemeralUserNotification,
    requestLocationConfirmation,
    appleSignin,
    applePayMerchantIds,
    excludedPackages,
  } = {},
) => {
  name ??= "Clip";
  bundleIdSuffix ??= "Clip";
  targetSuffix ??= "Clip";
  deploymentTarget ??= "14.0";
  appleSignin ??= false;

  if (!config.ios?.bundleIdentifier) {
    throw new Error("No bundle identifier specified in app config");
  }

  const bundleIdentifier = `${config.ios.bundleIdentifier}.${bundleIdSuffix}`;
  const targetName = `${IOSConfig.XcodeUtils.sanitizedName(config.name)}${targetSuffix}`;

  const modifiedConfig = withPlugins(config, [
    [
      withConfig,
      { targetName, bundleIdentifier, appleSignin, applePayMerchantIds },
    ],
    [
      withEntitlements,
      { targetName, groupIdentifier, appleSignin, applePayMerchantIds },
    ],
    [
      withXcode,
      {
        name,
        nativeClipSrcRootDir,
        targetName,
        bundleIdentifier,
        deploymentTarget,
      },
    ],
  ]);

  return modifiedConfig;
};

export default withAppClip;
