export const assertLocalAtlasSourceAllowed = (toolName) => {
  if (process.env.ALLOW_LOCAL_ATLAS_SOURCE === "1") return;

  console.error("");
  console.error(`${toolName} stopped.`);
  console.error("");
  console.error("This tool reads Reality_Mechanics as a local Atlas source.");
  console.error("The live Atlas should now be updated through the Garden/D1 path, not from local markdown.");
  console.error("");
  console.error("Use local files as drafts or mirrors only.");
  console.error("For a deliberate archival export from local files, rerun with:");
  console.error("  ALLOW_LOCAL_ATLAS_SOURCE=1");
  console.error("");
  process.exit(1);
};
