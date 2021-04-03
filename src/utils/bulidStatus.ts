type BuildStatus =
  | {
      isGit: false;
      buildTime?: string;
      isDirty?: never;
      hash?: never;
    }
  | {
      isGit: true;
      isDirty: boolean;
      hash: string;
      buildTime?: string;
    };

const buildStatus: BuildStatus = (() => {
  function padNum(num: number, len = 2): string {
    return num.toFixed(0).padStart(len, '0');
  }
  let buildTime: undefined | string;
  if (
    process.env.NEXT_BUILT_AT != null &&
    /^\d+$/.test(process.env.NEXT_BUILT_AT)
  ) {
    const date = new Date(Number.parseInt(process.env.NEXT_BUILT_AT, 10));
    buildTime = `${padNum(date.getUTCFullYear(), 4)}-${padNum(
      date.getUTCMonth() + 1,
    )}-${padNum(date.getUTCDate())} ${padNum(date.getUTCHours())}:${padNum(
      date.getUTCMinutes(),
    )} (UTC)`;
  }
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_BUILD_ID == null
  ) {
    return {
      isGit: false,
      buildTime,
    } as const;
  }
  const gitIdMatch = process.env.NEXT_BUILD_ID.match(
    /^GIT-([0-9a-fNO]+)(?:-([A-Z_][A-Z0-9_]*(?:-[A-Z_][A-Z0-9_]*)*))?$/,
  );
  if (gitIdMatch == null) {
    return {
      isGit: false,
      buildTime,
    } as const;
  }
  const [, hash, flags] = gitIdMatch;
  return {
    buildTime,
    isGit: true,
    hash: hash.replace(/NO/g, 'ad'),
    isDirty: flags != null && flags.split('-').includes('DIRTY'),
  } as const;
})();
export default buildStatus;
