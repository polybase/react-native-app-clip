import type { XcodeProject } from "expo/config-plugins";
import util from "node:util";

export function addBuildPhases(
  xcodeProject: XcodeProject,
  {
    targetUuid,
    groupName,
    productFile,
  }: {
    targetUuid: string;
    groupName: string;
    productFile: {
      uuid: string;
      target: string;
      basename: string;
      group: string;
    };
  },
) {
  const buildPath = `"$(CONTENTS_FOLDER_PATH)/AppClips"`;
  const folderType = "watch2_app"; // "watch2_app" uses the same subfolder spec (16), app_clip does not exist in cordova-node-xcode yet

  // TODO - avoid hardcoding
  const buildPhaseFiles = ['ContentView.swift', 'clippyClipApp.swift']

  // Sources build phase
  xcodeProject.addBuildPhase(
    buildPhaseFiles,
    "PBXSourcesBuildPhase",
    groupName,
    targetUuid,
    folderType,
    buildPath,
  );

  // Copy files build phase
  xcodeProject.addBuildPhase(
    [],
    "PBXCopyFilesBuildPhase",
    groupName,
    xcodeProject.getFirstTarget().uuid,
    folderType,
    buildPath,
  );

  xcodeProject
    .buildPhaseObject("PBXCopyFilesBuildPhase", groupName, productFile.target)
    .files.push({
      value: productFile.uuid,
      comment: util.format("%s in %s", productFile.basename, productFile.group), // longComment(file);
    });
  xcodeProject.addToPbxBuildFileSection(productFile);

  // Frameworks build phase
  xcodeProject.addBuildPhase(
    [],
    "PBXFrameworksBuildPhase",
    groupName,
    targetUuid,
    folderType,
    buildPath,
  );

  // TODO - avoid hardcoding
  xcodeProject.addBuildPhase(
    ["Preview Content", "Assets.xcassets"],
    "PBXResourcesBuildPhase",
    groupName,
    targetUuid,
    folderType,
    buildPath
  )
}
