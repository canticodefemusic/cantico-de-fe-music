export function runBuildPatch01Test(context) {
  const results = {
    hasContext: !!context,
    hasServices: context?.services instanceof Map,
    hasModules: context?.modules instanceof Map,
    serviceCount: context?.services?.size || 0,
    moduleCount: context?.modules?.size || 0,
    passed: false
  };

  results.passed =
    results.hasContext &&
    results.hasServices &&
    results.hasModules &&
    results.serviceCount >= 10 &&
    results.moduleCount >= 9;

  return results;
}
